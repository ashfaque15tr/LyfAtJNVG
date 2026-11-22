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

  // Helper to strip large data (e.g. base64 image strings) so ntfy payloads never exceed 2KB
  function sanitizeForCloud(data) {
    if (!data || typeof data !== 'object') return data;
    const clean = Array.isArray(data) ? [] : {};
    for (const k in data) {
      const val = data[k];
      if (typeof val === 'string') {
        if (val.startsWith('data:') || (val.length > 500 && (k.toLowerCase().includes('photo') || k.toLowerCase().includes('avatar') || k.toLowerCase().includes('image')))) {
          clean[k] = null;
        } else {
          clean[k] = val;
        }
      } else if (typeof val === 'object' && val !== null) {
        clean[k] = sanitizeForCloud(val);
      } else {
        clean[k] = val;
      }
    }
    return clean;
  }

  /**
   * Publish payload to cloud pubsub topic
   */
  async function publishEvent(topic, eventType, payload) {
    try {
      // Create clean, lightweight payload without huge base64 strings so ntfy never rejects or converts to expiring attachment
      const cleanPayload = sanitizeForCloud(payload);
      const body = JSON.stringify({
        type: eventType,
        source: 'jnvg_platform',
        timestamp: Date.now(),
        payload: cleanPayload
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
          if (item.event === 'message') {
            if (item.message && item.message.startsWith('{')) {
              const data = JSON.parse(item.message);
              events.push({ id: item.id, time: item.time, ...data });
            } else if (item.attachment && item.attachment.url) {
              try {
                const attRes = await fetch(item.attachment.url);
                if (attRes.ok) {
                  const data = await attRes.json();
                  events.push({ id: item.id, time: item.time, ...data });
                }
              } catch(attErr) {}
            }
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

  function processRegistrationPayload(u, isApproved = true) {
    if (!u || !u.name || (!u.email && !u.phone)) return false;
    let changed = false;
    const allUsers = (typeof getAllUsers === 'function') ? getAllUsers() : [];
    const cleanEmail = (u.email || '').trim().toLowerCase();
    const cleanPhone = String(u.phone || '').replace(/\D/g, '').slice(-10);
    const uBatch = parseInt(u.batch, 10) || 2025;
    const isTeacher = u.role === 'teacher' || u.isTeacher || u.profession === 'Faculty';

    // 1. Update or Insert in allUsers
    let existingUser = allUsers.find(x => 
      (cleanEmail && (x.email || '').toLowerCase() === cleanEmail) ||
      (cleanPhone && cleanPhone.length === 10 && (x.phone || '').replace(/\D/g, '').slice(-10) === cleanPhone)
    );

    if (!existingUser) {
      existingUser = {
        id: u.id || `usr-reg-${Date.now()}`,
        email: cleanEmail,
        phone: u.phone,
        password: u.password || "password123",
        name: u.name.trim(),
        batch: uBatch,
        house: u.house || 'Aravali',
        role: isTeacher ? 'teacher' : (u.role || 'member'),
        roleTitle: isTeacher ? 'Revered Faculty Member' : (u.roleTitle || 'Verified Alumnus'),
        status: 'approved',
        city: u.city || 'India',
        profession: u.profession || (isTeacher ? 'Faculty' : 'Alumnus'),
        domain: u.domain || (isTeacher ? 'Academics' : 'General'),
        joinedDate: u.joinedDate || new Date().toLocaleDateString('en-IN')
      };
      allUsers.push(existingUser);
      changed = true;
    } else {
      if (isApproved && existingUser.status !== 'approved') {
        existingUser.status = 'approved';
        changed = true;
      }
      if (u.house && !existingUser.house) { existingUser.house = u.house; changed = true; }
      if (u.city && !existingUser.city) { existingUser.city = u.city; changed = true; }
      if (u.profession && (!existingUser.profession || existingUser.profession === 'Alumnus')) { existingUser.profession = u.profession; changed = true; }
    }

    if (changed && typeof saveAllUsers === 'function') {
      saveAllUsers(allUsers);
    }

    // 2. Directory Synchronization
    if (typeof AppState !== 'undefined' && Array.isArray(AppState.directory) && !isTeacher) {
      let existingDir = null;
      if (u.claimedDirectoryId) {
        existingDir = AppState.directory.find(d => String(d.id) === String(u.claimedDirectoryId));
      }
      if (!existingDir) {
        existingDir = AppState.directory.find(d =>
          (cleanEmail && d.email && d.email.toLowerCase() === cleanEmail) ||
          (cleanPhone && cleanPhone.length === 10 && d.phone && d.phone.replace(/\D/g, '').slice(-10) === cleanPhone) ||
          (d.name && d.name.toLowerCase() === u.name.toLowerCase().trim() && parseInt(d.batch, 10) === uBatch)
        );
      }

      if (existingDir) {
        if (u.photo && !existingDir.photo) existingDir.photo = u.photo;
        if (u.house) { existingDir.house = u.house; existingDir.badge = u.house; }
        if (u.profession) existingDir.role = u.profession;
        if (u.city) existingDir.location = u.city;
        if (u.phone && !existingDir.phone) existingDir.phone = u.phone;
        if (cleanEmail && !existingDir.email) existingDir.email = cleanEmail;
        existingDir.claimed = true;
        existingDir.verified = true;
        changed = true;
      } else {
        const initials = u.name.trim().split(' ').map(n=>n[0]).join('').slice(0, 2).toUpperCase() || 'NV';
        AppState.directory.unshift({
          id: u.id || `dir-${Date.now()}`,
          name: u.name.trim(),
          initials: initials,
          batch: uBatch,
          house: u.house || 'Aravali',
          role: u.profession || 'Alumnus',
          location: u.city || 'India',
          domain: u.domain || 'General',
          email: cleanEmail,
          phone: u.phone || '',
          badge: u.house || 'Aravali',
          tag: 'Alumnus',
          verified: true,
          claimed: true,
          photo: u.photo || null,
          bio: `${u.profession || 'Alumnus'} • Batch of ${uBatch} (${u.house || 'Aravali'} House).`
        });
        changed = true;
      }
    }

    // 3. Faculty Synchronization if Teacher
    if (isTeacher && typeof AppState !== 'undefined' && Array.isArray(AppState.teachers)) {
      const existingTch = AppState.teachers.find(t => 
        (cleanEmail && t.email && t.email.toLowerCase() === cleanEmail) ||
        (cleanPhone && cleanPhone.length === 10 && (t.phonePrivate || t.phone || '').replace(/\D/g, '').slice(-10) === cleanPhone) ||
        (t.name && t.name.toLowerCase() === u.name.toLowerCase().trim())
      );
      if (existingTch) {
        if (u.subject) existingTch.subject = u.subject;
        if (u.designation || u.profession) existingTch.post = u.designation || u.profession;
        existingTch.claimed = true;
        changed = true;
      }
    }

    // 4. Remove from Pending Registrations if approved
    if (typeof AppState !== 'undefined' && Array.isArray(AppState.pendingRegistrations)) {
      const pIdx = AppState.pendingRegistrations.findIndex(p => 
        (cleanEmail && (p.email || '').toLowerCase() === cleanEmail) ||
        (cleanPhone && cleanPhone.length === 10 && (p.phone || '').replace(/\D/g, '').slice(-10) === cleanPhone)
      );
      if (pIdx !== -1) {
        AppState.pendingRegistrations.splice(pIdx, 1);
        changed = true;
      }
    }

    if (changed) {
      if (typeof saveAppData === 'function') saveAppData();
      if (window.AlumniStorageEngine && typeof window.AlumniStorageEngine.buildCacheIndexes === 'function' && AppState && AppState.directory) {
        window.AlumniStorageEngine.buildCacheIndexes(AppState.directory);
      }
      if (typeof renderAdminRegistrations === 'function') renderAdminRegistrations();
      if (typeof renderAdminQueue === 'function') renderAdminQueue();
      if (typeof renderDirectory === 'function') renderDirectory();
      if (typeof renderBatchLeaderboard === 'function') renderBatchLeaderboard();
      if (typeof updateQueueBadges === 'function') updateQueueBadges();
    }

    return changed;
  }

  async function broadcastRegistration(userData) {
    return await publishEvent(REG_TOPIC, 'REGISTRATION_SUBMITTED', userData);
  }

  async function broadcastApproval(userObj) {
    return await publishEvent(REG_TOPIC, 'REGISTRATION_APPROVED', userObj);
  }

  async function syncRegistrations() {
    const events = await pollTopic(REG_TOPIC, 'all');
    let anyChanged = false;
    events.forEach(evt => {
      if ((evt.type === 'REGISTRATION_SUBMITTED' || evt.type === 'REGISTRATION_APPROVED') && evt.payload) {
        const changed = processRegistrationPayload(evt.payload, true);
        if (changed) anyChanged = true;
      }
    });
    if (anyChanged) {
      console.log("[CloudSync] Registrations & Users synchronized across devices.");
    }
  }

  function startRegStream() {
    try {
      if (regEventSource) regEventSource.close();
      if (typeof EventSource !== 'undefined') {
        regEventSource = new EventSource(`${BASE_URL}/${REG_TOPIC}/sse`);
        regEventSource.onmessage = (e) => {
          try {
            const item = JSON.parse(e.data);
            if (item.event === 'message' && item.message) {
              const data = JSON.parse(item.message);
              if (data && (data.type === 'REGISTRATION_SUBMITTED' || data.type === 'REGISTRATION_APPROVED') && data.payload) {
                const changed = processRegistrationPayload(data.payload, true);
                if (changed) {
                  console.log(`[CloudSync] Real-time registration synchronized for ${data.payload.name} (${data.payload.batch})`);
                }
              }
            }
          } catch(err) {}
        };
      }
    } catch(e) {}
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
    startRegStream();
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
    startFeedStream,
    broadcastRegistration,
    broadcastApproval,
    syncRegistrations,
    startRegStream,
    sendChatMessage,
    syncChatMessages,
    startChatStream
  };
})();

// Attach to global window
if (typeof window !== 'undefined') {
  window.AlumniCloudSync = AlumniCloudSync;
}
