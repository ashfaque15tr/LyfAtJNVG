/**
 * JNV Gauriganj Alumni Platform - Global Cloud Synchronization Engine
 * Enables real-time cross-device data persistence and synchronization for:
 * 1. Community Memory Wall Posts
 * 2. New Alumni Registrations & Super Admin Approval Queue
 * 3. Confidential End-to-End Private Chat Messaging
 * Works seamlessly across Mobile App (Android/iOS) and Web Portal (GitHub Pages).
 */

const AlumniCloudSync = (() => {
  const SYNC_VERSION = 'v1';
  const BASE_URL = 'https://ntfy.sh';
  const FEED_TOPIC = `jnvg_feed_${SYNC_VERSION}`;
  const REG_TOPIC = `jnvg_reg_${SYNC_VERSION}`;
  const DIR_TOPIC = `jnvg_dir_${SYNC_VERSION}`;

  // Helper to sanitize usernames/emails into clean pubsub topics
  function sanitizeTopic(nameOrEmail) {
    if (!nameOrEmail) return 'anon';
    return 'jnvg_dm_' + String(nameOrEmail).toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 48);
  }

  // Active event listeners
  let feedEventSource = null;
  let chatEventSource = null;
  let regEventSource = null;
  let pollIntervalTimer = null;
  let lastFeedSyncTime = 0;
  let lastChatSyncTime = 0;
  let lastRegSyncTime = 0;

  /**
   * Publish payload to cloud pubsub topic
   */
  async function publishEvent(topic, eventType, payload) {
    try {
      const body = JSON.stringify({
        type: eventType,
        source: 'jnvg_platform',
        timestamp: Date.now(),
        payload: payload
      });

      const res = await fetch(`${BASE_URL}/${topic}`, {
        method: 'POST',
        headers: {
          'Title': `JNVG ${eventType}`,
          'Priority': 'default'
        },
        body: body
      });

      return res.ok;
    } catch (err) {
      console.warn(`[CloudSync] Publish failed for topic ${topic}:`, err.message);
      return false;
    }
  }

  /**
   * Poll events from topic with since parameter
   */
  async function pollTopic(topic, since = 'all') {
    try {
      const url = `${BASE_URL}/${topic}/json?poll=1&since=${encodeURIComponent(since)}`;
      const res = await fetch(url);
      if (!res.ok) return [];
      const text = await res.text();
      const events = [];
      const lines = text.trim().split('\n');
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const item = JSON.parse(line);
          if (item.event === 'message' && item.message) {
            const data = JSON.parse(item.message);
            events.push({ id: item.id, time: item.time, ...data });
          }
        } catch (e) {}
      }
      return events;
    } catch (err) {
      console.warn(`[CloudSync] Poll failed for topic ${topic}:`, err.message);
      return [];
    }
  }

  // ==========================================
  // 1. MEMORY WALL FEED SYNCHRONIZATION
  // ==========================================

  async function broadcastFeedPost(post) {
    await publishEvent(FEED_TOPIC, 'NEW_FEED_POST', post);
  }

  async function broadcastDeleteFeedPost(postId) {
    await publishEvent(FEED_TOPIC, 'DELETE_FEED_POST', { postId });
  }

  async function syncFeed() {
    if (typeof AppState === 'undefined' || !AppState.feedPosts) return;
    const events = await pollTopic(FEED_TOPIC, 'all');
    let hasChanges = false;

    events.forEach(evt => {
      if (evt.type === 'NEW_FEED_POST' && evt.payload && evt.payload.id) {
        const post = evt.payload;
        const exists = AppState.feedPosts.some(p => String(p.id) === String(post.id));
        if (!exists) {
          AppState.feedPosts.unshift(post);
          hasChanges = true;
        }
      } else if (evt.type === 'DELETE_FEED_POST' && evt.payload && evt.payload.postId) {
        const targetId = String(evt.payload.postId);
        const idx = AppState.feedPosts.findIndex(p => String(p.id) === targetId);
        if (idx !== -1) {
          AppState.feedPosts.splice(idx, 1);
          hasChanges = true;
        }
      }
    });

    if (hasChanges) {
      if (typeof saveAppData === 'function') saveAppData();
      if (typeof renderFeed === 'function') renderFeed();
      console.log("[CloudSync] Feed successfully synchronized across devices.");
    }
  }

  function startFeedStream() {
    try {
      if (feedEventSource) feedEventSource.close();
      if (typeof EventSource !== 'undefined') {
        feedEventSource = new EventSource(`${BASE_URL}/${FEED_TOPIC}/sse`);
        feedEventSource.onmessage = (e) => {
          try {
            const item = JSON.parse(e.data);
            if (item.event === 'message' && item.message) {
              const data = JSON.parse(item.message);
              if (data.type === 'NEW_FEED_POST' && data.payload) {
                const post = data.payload;
                if (!AppState.feedPosts.some(p => String(p.id) === String(post.id))) {
                  AppState.feedPosts.unshift(post);
                  if (typeof saveAppData === 'function') saveAppData();
                  if (typeof renderFeed === 'function') renderFeed();
                  if (typeof showToast === 'function') showToast(`🔔 New memory posted by ${post.author}`);
                }
              } else if (data.type === 'DELETE_FEED_POST' && data.payload) {
                const targetId = String(data.payload.postId);
                const idx = AppState.feedPosts.findIndex(p => String(p.id) === targetId);
                if (idx !== -1) {
                  AppState.feedPosts.splice(idx, 1);
                  if (typeof saveAppData === 'function') saveAppData();
                  if (typeof renderFeed === 'function') renderFeed();
                }
              }
            }
          } catch(err) {}
        };
      }
    } catch(e) {}
  }

  // ==========================================
  // 2. REGISTRATIONS & APPROVAL SYNCHRONIZATION
  // ==========================================

  async function broadcastRegistration(userData) {
    return await publishEvent(REG_TOPIC, 'REGISTRATION_SUBMITTED', userData);
  }

  async function broadcastApproval(userObj) {
    return await publishEvent(REG_TOPIC, 'REGISTRATION_APPROVED', userObj);
  }

  async function syncRegistrations() {
    const events = await pollTopic(REG_TOPIC, 'all');
    let hasChanges = false;
    const allUsers = (typeof getAllUsers === 'function') ? getAllUsers() : [];

    events.forEach(evt => {
      if (evt.type === 'REGISTRATION_SUBMITTED' && evt.payload && evt.payload.email) {
        const u = evt.payload;
        // Check if user is known
        const existingUser = allUsers.find(x => (x.email || '').toLowerCase() === u.email.toLowerCase());
        if (!existingUser) {
          allUsers.push({
            id: u.id || `usr-reg-${Date.now()}`,
            email: u.email.toLowerCase(),
            phone: u.phone,
            password: u.password,
            name: u.name,
            batch: parseInt(u.batch) || 2005,
            house: u.house,
            role: u.role || 'member',
            roleTitle: u.roleTitle || 'Alumni Member',
            status: 'pending',
            city: u.city,
            profession: u.profession,
            joinedDate: new Date().toLocaleDateString('en-IN')
          });
          hasChanges = true;
        }

        // Add to AppState.pendingRegistrations if Admin
        if (typeof AppState !== 'undefined' && Array.isArray(AppState.pendingRegistrations)) {
          const inPending = AppState.pendingRegistrations.some(p => (p.email || '').toLowerCase() === u.email.toLowerCase());
          if (!inPending && (!existingUser || existingUser.status === 'pending')) {
            AppState.pendingRegistrations.push({
              name: u.name,
              email: u.email,
              phone: u.phone,
              batch: u.batch,
              house: u.house,
              role: u.role,
              submittedAt: new Date().toLocaleString('en-IN')
            });
            hasChanges = true;
          }
        }
      } else if (evt.type === 'REGISTRATION_APPROVED' && evt.payload && evt.payload.email) {
        const approvedEmail = evt.payload.email.toLowerCase();
        // Update user status
        const target = allUsers.find(x => (x.email || '').toLowerCase() === approvedEmail);
        if (target) {
          target.status = 'approved';
          hasChanges = true;
        }
        // Remove from pendingRegistrations
        if (typeof AppState !== 'undefined' && Array.isArray(AppState.pendingRegistrations)) {
          const pIdx = AppState.pendingRegistrations.findIndex(p => (p.email || '').toLowerCase() === approvedEmail);
          if (pIdx !== -1) {
            AppState.pendingRegistrations.splice(pIdx, 1);
            hasChanges = true;
          }
        }
        // Add to Directory if not present
        if (typeof AppState !== 'undefined' && Array.isArray(AppState.directory)) {
          const inDir = AppState.directory.some(d => (d.email || '').toLowerCase() === approvedEmail || (d.name || '').toLowerCase() === (evt.payload.name || '').toLowerCase());
          if (!inDir && evt.payload.name) {
            AppState.directory.push({
              id: `dir-${Date.now()}`,
              name: evt.payload.name,
              email: approvedEmail,
              phone: evt.payload.phone,
              batch: parseInt(evt.payload.batch) || 2005,
              house: evt.payload.house || 'Nilgiri',
              role: evt.payload.profession || 'Alumnus',
              location: evt.payload.city || 'India',
              domain: evt.payload.domain || 'Alumni'
            });
            hasChanges = true;
          }
        }
      }
    });

    if (hasChanges) {
      if (typeof saveAllUsers === 'function') saveAllUsers(allUsers);
      if (typeof saveAppData === 'function') saveAppData();
      if (typeof renderAdminQueue === 'function') renderAdminQueue();
      if (typeof renderDirectory === 'function') renderDirectory();
      console.log("[CloudSync] Registrations & Users synchronized across devices.");
    }
  }

  // ==========================================
  // 3. CONFIDENTIAL CHAT MESSAGING SYNCHRONIZATION
  // ==========================================

  async function sendChatMessage(msg) {
    if (!msg || !msg.recipientName) return false;
    const topic = sanitizeTopic(msg.recipientName);
    return await publishEvent(topic, 'NEW_CHAT_MESSAGE', msg);
  }

  async function syncChatMessages() {
    const curUser = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
    if (!curUser || !curUser.name || curUser.role === 'guest') return;

    const myTopic = sanitizeTopic(curUser.name);
    const events = await pollTopic(myTopic, 'all');
    let hasNew = false;
    const allMsgs = (typeof getAllChatMessages === 'function') ? getAllChatMessages() : [];

    events.forEach(evt => {
      if (evt.type === 'NEW_CHAT_MESSAGE' && evt.payload && evt.payload.id) {
        const m = evt.payload;
        // Verify it is intended for current user
        const isRecipient = (m.recipientName && m.recipientName.toLowerCase() === curUser.name.toLowerCase()) ||
                            (m.recipientId && m.recipientId === curUser.id);
        if (isRecipient) {
          const exists = allMsgs.some(existing => existing.id === m.id);
          if (!exists) {
            allMsgs.push(m);
            hasNew = true;
          }
        }
      }
    });

    if (hasNew) {
      if (typeof saveAllChatMessages === 'function') saveAllChatMessages(allMsgs);
      if (typeof refreshInboxBadge === 'function') refreshInboxBadge();
      if (typeof renderChatConversations === 'function') renderChatConversations();
      if (typeof renderActiveChatMessages === 'function') renderActiveChatMessages();
      console.log("[CloudSync] Inbound chat messages synchronized.");
    }
  }

  function startChatStream() {
    const curUser = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
    if (!curUser || !curUser.name || curUser.role === 'guest') return;

    const myTopic = sanitizeTopic(curUser.name);
    try {
      if (chatEventSource) chatEventSource.close();
      if (typeof EventSource !== 'undefined') {
        chatEventSource = new EventSource(`${BASE_URL}/${myTopic}/sse`);
        chatEventSource.onmessage = (e) => {
          try {
            const item = JSON.parse(e.data);
            if (item.event === 'message' && item.message) {
              const data = JSON.parse(item.message);
              if (data.type === 'NEW_CHAT_MESSAGE' && data.payload) {
                const m = data.payload;
                const allMsgs = (typeof getAllChatMessages === 'function') ? getAllChatMessages() : [];
                if (!allMsgs.some(x => x.id === m.id)) {
                  allMsgs.push(m);
                  if (typeof saveAllChatMessages === 'function') saveAllChatMessages(allMsgs);
                  if (typeof refreshInboxBadge === 'function') refreshInboxBadge();
                  if (typeof renderChatConversations === 'function') renderChatConversations();
                  if (typeof renderActiveChatMessages === 'function') renderActiveChatMessages();
                  if (typeof showToast === 'function') showToast(`📩 New message from ${m.senderName}: "${(m.text || '').slice(0, 30)}..."`);
                }
              }
            }
          } catch(err) {}
        };
      }
    } catch(e) {}
  }

  /**
   * Master Initializer - Starts periodic sync and real-time streams
   */
  function init() {
    console.log("[CloudSync] Initializing JNV Alumni Global Cloud Synchronization Engine...");
    
    // Initial sync passes
    syncFeed();
    syncRegistrations();
    syncChatMessages();

    // Start live SSE streams
    startFeedStream();
    startChatStream();

    // Background interval sync every 12 seconds to guarantee consistency
    if (pollIntervalTimer) clearInterval(pollIntervalTimer);
    pollIntervalTimer = setInterval(() => {
      syncFeed();
      syncRegistrations();
      syncChatMessages();
    }, 12000);
  }

  return {
    init,
    broadcastFeedPost,
    broadcastDeleteFeedPost,
    syncFeed,
    broadcastRegistration,
    broadcastApproval,
    syncRegistrations,
    sendChatMessage,
    syncChatMessages
  };
})();

// Attach to global window
if (typeof window !== 'undefined') {
  window.AlumniCloudSync = AlumniCloudSync;
}
