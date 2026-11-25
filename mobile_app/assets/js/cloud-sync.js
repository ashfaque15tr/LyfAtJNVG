/**
 * JNV Gauriganj Alumni Platform - Global Cloud Synchronization Engine
 * Enables real-time cross-device data persistence and synchronization for:
 * 1. Community Memory Wall Posts (New, Edits, Photos, Likes, Comments, Deletions)
 * 2. New Alumni Registrations, Profile Claims, Profile Edits, Role Updates & Deletions
 * 3. Gurujan / Faculty Messages, Photos, Tributes & Enrollment
 * 4. 4th Annual Meet RSVPs, Cultural Acts, Schedule, Donations, Helpdesk & Suggestions
 * 5. Confidential End-to-End Private Chat Messaging & Audit Logs
 * Works seamlessly across Mobile App (Android/iOS) and Web Portal (GitHub Pages).
 */

const AlumniCloudSync = (() => {
  const SYNC_VERSION = 'v1';
  const BASE_URL = 'https://ntfy.sh';
  const FEED_TOPIC = `jnvg_feed_${SYNC_VERSION}`;
  const REG_TOPIC = `jnvg_reg_${SYNC_VERSION}`;
  const ACTIVITY_TOPIC = `jnvg_activity_${SYNC_VERSION}`;
  const OUTBOX_STORAGE_KEY = 'jnvg_cloud_outbox_v1';

  // Helper to sanitize usernames/emails into clean pubsub topics
  function sanitizeTopic(nameOrEmail) {
    if (!nameOrEmail) return 'anon';
    return 'jnvg_dm_' + String(nameOrEmail).toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 48);
  }

  // Active event listeners
  let feedEventSource = null;
  let chatEventSource = null;
  let adminAliasChatEventSource = null;
  let regEventSource = null;
  let activityEventSource = null;
  let pollIntervalTimer = null;
  let isFlushingOutbox = false;

  // Preserve compressed photos (<= 350KB) so Memory Wall & Profile photos sync across devices
  function sanitizeForCloud(data) {
    if (!data || typeof data !== 'object') return data;
    const clean = Array.isArray(data) ? [] : {};
    for (const k in data) {
      const val = data[k];
      if (typeof val === 'string') {
        if (val.length > 350000) {
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

  // Persistent Outbox Queue so no post, like, registration or activity is lost on network blips
  function getOutbox() {
    try {
      if (typeof localStorage === 'undefined') return [];
      return JSON.parse(localStorage.getItem(OUTBOX_STORAGE_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveOutbox(queue) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(OUTBOX_STORAGE_KEY, JSON.stringify(queue.slice(-40)));
      }
    } catch (e) {}
  }

  function enqueueOutbox(topic, eventType, body) {
    const queue = getOutbox();
    const id = 'ob-' + Date.now() + '-' + Math.floor(Math.random() * 100000);
    queue.push({ id, topic, eventType, body, createdAt: Date.now() });
    saveOutbox(queue);
    return id;
  }

  function removeFromOutbox(id) {
    const queue = getOutbox().filter(item => item.id !== id);
    saveOutbox(queue);
  }

  async function sendRawToNtfy(topic, eventType, body) {
    const res = await fetch(`${BASE_URL}/${topic}`, {
      method: 'POST',
      headers: {
        'Title': `JNVG ${eventType}`,
        'Priority': 'default'
      },
      body: body
    });
    return res.ok;
  }

  async function flushOutbox() {
    if (isFlushingOutbox) return;
    const queue = getOutbox();
    if (!queue.length) return;
    isFlushingOutbox = true;
    try {
      for (const item of queue) {
        try {
          const ok = await sendRawToNtfy(item.topic, item.eventType, item.body);
          if (ok) {
            removeFromOutbox(item.id);
          }
        } catch (err) {
          break; // Stop flushing if still offline
        }
      }
    } finally {
      isFlushingOutbox = false;
    }
  }

  /**
   * Publish payload to cloud pubsub topic with automatic Outbox retry
   */
  async function publishEvent(topic, eventType, payload) {
    try {
      const cleanPayload = sanitizeForCloud(payload);
      const body = JSON.stringify({
        type: eventType,
        source: 'jnvg_platform',
        timestamp: Date.now(),
        payload: cleanPayload
      });

      const outboxId = enqueueOutbox(topic, eventType, body);
      const ok = await sendRawToNtfy(topic, eventType, body);
      if (ok) {
        removeFromOutbox(outboxId);
      }
      return ok;
    } catch (err) {
      console.warn(`[CloudSync] Publish queued for retry (${topic}/${eventType}):`, err.message);
      return false;
    }
  }

  /**
   * Unified ntfy message parser: supports both inline JSON and attachment.json (for photos)
   */
  async function parseNtfyItem(item) {
    if (!item || item.event !== 'message') return null;
    try {
      if (item.message && item.message.startsWith('{')) {
        const data = JSON.parse(item.message);
        return { id: item.id, time: item.time, ...data };
      } else if (item.attachment && item.attachment.url) {
        const attRes = await fetch(item.attachment.url);
        if (attRes.ok) {
          const data = await attRes.json();
          return { id: item.id, time: item.time, ...data };
        }
      }
    } catch (e) {}
    return null;
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
          const parsed = await parseNtfyItem(item);
          if (parsed) events.push(parsed);
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

  function applyFeedEvent(evt) {
    if (typeof AppState === 'undefined' || !AppState.feedPosts) return false;
    let hasChanges = false;

    if ((evt.type === 'NEW_FEED_POST' || evt.type === 'UPDATE_FEED_POST') && evt.payload && evt.payload.id) {
      const post = evt.payload;
      const existingIdx = AppState.feedPosts.findIndex(p => String(p.id) === String(post.id));
      if (existingIdx === -1) {
        AppState.feedPosts.unshift(post);
        hasChanges = true;
      } else {
        const existing = AppState.feedPosts[existingIdx];
        const incomingTs = evt.timestamp || post.updatedAt || 0;
        const existingTs = existing.updatedAt || 0;
        const contentChanged = (post.content && post.content !== existing.content) || (post.text && post.text !== existing.text);
        const imageChanged = post.image && post.image !== existing.image;
        const photoChanged = post.authorPhoto && post.authorPhoto !== existing.authorPhoto;
        if (incomingTs >= existingTs && (contentChanged || imageChanged || photoChanged || evt.type === 'UPDATE_FEED_POST')) {
          AppState.feedPosts[existingIdx] = {
            ...existing,
            ...post,
            likes: Math.max(existing.likes || 0, post.likes || 0),
            comments: Array.isArray(existing.comments) && existing.comments.length >= (post.comments || []).length
              ? existing.comments
              : (post.comments || []),
            updatedAt: incomingTs || Date.now()
          };
          hasChanges = true;
        }
      }
      // Also keep matching teacher card message in sync if this is a Gurujan Sandesh post
      if (post.isTeacher && Array.isArray(AppState.teachers) && post.author) {
        const tMatch = AppState.teachers.find(t =>
          (t.name && t.name.toLowerCase() === post.author.toLowerCase()) ||
          (post.teacherId && String(t.id) === String(post.teacherId))
        );
        if (tMatch && post.content && post.id && String(post.id).startsWith('feed-gurujan-')) {
          const cleanMsg = String(post.content).replace(/^"|"$/g, '');
          if (tMatch.message !== cleanMsg) {
            tMatch.message = cleanMsg;
            hasChanges = true;
          }
        }
      }
    } else if (evt.type === 'FEED_POST_PHOTO' && evt.payload && evt.payload.postId && evt.payload.image) {
      const target = AppState.feedPosts.find(p => String(p.id) === String(evt.payload.postId));
      if (target && target.image !== evt.payload.image) {
        target.image = evt.payload.image;
        hasChanges = true;
      }
    } else if (evt.type === 'LIKE_FEED_POST' && evt.payload && evt.payload.postId) {
      const target = AppState.feedPosts.find(p => String(p.id) === String(evt.payload.postId));
      if (target) {
        const nextLikes = Math.max(target.likes || 0, evt.payload.likes || 0);
        if (nextLikes > (target.likes || 0)) {
          target.likes = nextLikes;
          hasChanges = true;
        }
      }
    } else if (evt.type === 'COMMENT_FEED_POST' && evt.payload && evt.payload.postId && evt.payload.comment) {
      const target = AppState.feedPosts.find(p => String(p.id) === String(evt.payload.postId));
      if (target) {
        if (!Array.isArray(target.comments)) target.comments = [];
        const c = evt.payload.comment;
        const already = target.comments.some(x => (c.id && x.id === c.id) || (x.author === c.author && x.text === c.text));
        if (!already) {
          target.comments.push(c);
          hasChanges = true;
        }
      }
    } else if (evt.type === 'DELETE_FEED_POST' && evt.payload && evt.payload.postId) {
      const targetId = String(evt.payload.postId);
      const idx = AppState.feedPosts.findIndex(p => String(p.id) === targetId);
      if (idx !== -1) {
        AppState.feedPosts.splice(idx, 1);
        hasChanges = true;
      }
    }

    return hasChanges;
  }

  async function broadcastFeedPost(post) {
    const hasLargeImage = post && typeof post.image === 'string' && post.image.length > 2500;
    const basePost = hasLargeImage ? { ...post, image: null, updatedAt: Date.now() } : { ...post, updatedAt: Date.now() };
    const ok = await publishEvent(FEED_TOPIC, 'NEW_FEED_POST', basePost);
    if (hasLargeImage) {
      await publishEvent(FEED_TOPIC, 'FEED_POST_PHOTO', { postId: post.id, image: post.image });
    }
    return ok;
  }

  async function broadcastFeedLike(postId, likes) {
    return await publishEvent(FEED_TOPIC, 'LIKE_FEED_POST', { postId, likes });
  }

  async function broadcastFeedComment(postId, comment) {
    return await publishEvent(FEED_TOPIC, 'COMMENT_FEED_POST', { postId, comment });
  }

  async function broadcastDeleteFeedPost(postId) {
    return await publishEvent(FEED_TOPIC, 'DELETE_FEED_POST', { postId });
  }

  async function syncFeed() {
    if (typeof AppState === 'undefined' || !AppState.feedPosts) return;
    const events = await pollTopic(FEED_TOPIC, 'all');
    let hasChanges = false;

    events.forEach(evt => {
      if (applyFeedEvent(evt)) hasChanges = true;
    });

    if (hasChanges) {
      if (typeof saveAppData === 'function') saveAppData();
      if (typeof renderFeed === 'function') renderFeed();
      if (typeof renderTeachers === 'function') renderTeachers();
      console.log("[CloudSync] Feed successfully synchronized across devices.");
    }
  }

  function startFeedStream() {
    try {
      if (feedEventSource) feedEventSource.close();
      if (typeof EventSource !== 'undefined') {
        feedEventSource = new EventSource(`${BASE_URL}/${FEED_TOPIC}/sse`);
        feedEventSource.onmessage = async (e) => {
          try {
            const item = JSON.parse(e.data);
            const data = await parseNtfyItem(item);
            if (!data) return;
            const changed = applyFeedEvent(data);
            if (changed) {
              if (typeof saveAppData === 'function') saveAppData();
              if (typeof renderFeed === 'function') renderFeed();
              if (typeof renderTeachers === 'function') renderTeachers();
              if (data.type === 'NEW_FEED_POST' && data.payload && typeof showToast === 'function') {
                showToast(`🔔 New memory posted by ${data.payload.author}`);
              }
            }
          } catch (err) {}
        };
      }
    } catch (e) {}
  }

  // ==========================================
  // 2. REGISTRATIONS, PROFILE CLAIMS, ROLES & FACULTY SYNC
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
        photo: u.photo || null,
        bio: u.bio || '',
        claimedDirectoryId: u.claimedDirectoryId || null,
        claimedTeacherId: u.claimedTeacherId || null,
        joinedDate: u.joinedDate || new Date().toLocaleDateString('en-IN')
      };
      allUsers.push(existingUser);
      changed = true;
    } else {
      if (isApproved && existingUser.status !== 'approved') { existingUser.status = 'approved'; changed = true; }
      if (u.name && u.name.trim() !== existingUser.name) { existingUser.name = u.name.trim(); changed = true; }
      if (u.house && u.house !== existingUser.house) { existingUser.house = u.house; changed = true; }
      if (u.city && u.city !== existingUser.city) { existingUser.city = u.city; changed = true; }
      if (u.profession && u.profession !== existingUser.profession) { existingUser.profession = u.profession; changed = true; }
      if (u.domain && u.domain !== existingUser.domain) { existingUser.domain = u.domain; changed = true; }
      if (u.phone && u.phone !== existingUser.phone) { existingUser.phone = u.phone; changed = true; }
      if (u.bio && u.bio !== existingUser.bio) { existingUser.bio = u.bio; changed = true; }
      if (u.photo && u.photo !== existingUser.photo) { existingUser.photo = u.photo; changed = true; }
      if (u.claimedDirectoryId && !existingUser.claimedDirectoryId) { existingUser.claimedDirectoryId = u.claimedDirectoryId; changed = true; }
      if (u.claimedTeacherId && !existingUser.claimedTeacherId) { existingUser.claimedTeacherId = u.claimedTeacherId; changed = true; }
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
        if (u.name && u.name.trim() !== existingDir.name) { existingDir.name = u.name.trim(); changed = true; }
        if (u.photo && u.photo !== existingDir.photo) { existingDir.photo = u.photo; existingDir.avatarImage = u.photo; changed = true; }
        if (u.house && u.house !== existingDir.house) { existingDir.house = u.house; existingDir.badge = u.house; changed = true; }
        if (u.profession && u.profession !== existingDir.role) { existingDir.role = u.profession; changed = true; }
        if (u.city && u.city !== existingDir.location) { existingDir.location = u.city; existingDir.city = u.city; changed = true; }
        if (u.domain && u.domain !== existingDir.domain) { existingDir.domain = u.domain; changed = true; }
        if (u.phone && u.phone !== existingDir.phone) { existingDir.phone = u.phone; changed = true; }
        if (u.bio && u.bio !== existingDir.bio) { existingDir.bio = u.bio; changed = true; }
        if (cleanEmail && !existingDir.email) { existingDir.email = cleanEmail; changed = true; }
        if (!existingDir.claimed) { existingDir.claimed = true; changed = true; }
        if (!existingDir.verified) { existingDir.verified = true; changed = true; }
      } else {
        const initials = u.name.trim().split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'NV';
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
          bio: u.bio || `${u.profession || 'Alumnus'} • Batch of ${uBatch} (${u.house || 'Aravali'} House).`
        });
        changed = true;
      }
    }

    // 3. Faculty Synchronization if Teacher
    if (isTeacher && typeof AppState !== 'undefined' && Array.isArray(AppState.teachers)) {
      const existingTch = AppState.teachers.find(t =>
        (u.claimedTeacherId && String(t.id) === String(u.claimedTeacherId)) ||
        (cleanEmail && t.email && t.email.toLowerCase() === cleanEmail) ||
        (cleanPhone && cleanPhone.length === 10 && (t.phonePrivate || t.phone || '').replace(/\D/g, '').slice(-10) === cleanPhone) ||
        (t.name && t.name.toLowerCase() === u.name.toLowerCase().trim())
      );
      if (existingTch) {
        if (u.subject) existingTch.subject = u.subject;
        if (u.designation || u.profession) existingTch.post = u.designation || u.profession;
        if (u.photo && u.photo !== existingTch.photo) existingTch.photo = u.photo;
        if (u.bio && u.bio !== existingTch.message) existingTch.message = u.bio;
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
      if (typeof logPlatformActivity === 'function') {
        const uBatchStr = uBatch ? `Batch of ${uBatch}` : 'Alumnus';
        const houseStr = u.house ? `${u.house} House` : 'Navodaya';
        logPlatformActivity('REGISTRATION', u.name, `${u.name} (${uBatchStr}, ${houseStr}) updated/claimed verified alumni directory profile.`, { batch: uBatch, house: u.house, email: cleanEmail });
      }
      if (typeof renderAdminRegistrations === 'function') renderAdminRegistrations();
      if (typeof renderAdminQueue === 'function') renderAdminQueue();
      if (typeof renderDirectory === 'function') renderDirectory();
      if (typeof renderTeachers === 'function') renderTeachers();
      if (typeof renderBatchLeaderboard === 'function') renderBatchLeaderboard();
      if (typeof renderAuditLogs === 'function') renderAuditLogs();
      if (typeof updateQueueBadges === 'function') updateQueueBadges();
    }

    return changed;
  }

  function applyRegEvent(evt) {
    if (!evt || !evt.type || !evt.payload) return false;
    if (evt.type === 'REGISTRATION_SUBMITTED' || evt.type === 'REGISTRATION_APPROVED' || evt.type === 'PROFILE_UPDATED' || evt.type === 'PROFILE_CLAIMED') {
      return processRegistrationPayload(evt.payload, true);
    }
    if (evt.type === 'ROLE_UPDATED') {
      const { email, name, role, roleTitle } = evt.payload;
      let changed = false;
      const allUsers = (typeof getAllUsers === 'function') ? getAllUsers() : [];
      const u = allUsers.find(x => (email && (x.email || '').toLowerCase() === email.toLowerCase()) || (name && x.name.toLowerCase() === name.toLowerCase()));
      if (u && (u.role !== role || u.roleTitle !== roleTitle)) {
        u.role = role;
        if (roleTitle) u.roleTitle = roleTitle;
        if (typeof saveAllUsers === 'function') saveAllUsers(allUsers);
        changed = true;
      }
      if (typeof AppState !== 'undefined' && Array.isArray(AppState.directory)) {
        const d = AppState.directory.find(x => (email && (x.email || '').toLowerCase() === email.toLowerCase()) || (name && x.name.toLowerCase() === name.toLowerCase()));
        if (d && d.systemRole !== role) {
          d.systemRole = role;
          changed = true;
        }
      }
      if (changed) {
        if (typeof saveAppData === 'function') saveAppData();
        if (typeof renderDirectory === 'function') renderDirectory();
        if (typeof renderAdminQueue === 'function') renderAdminQueue();
      }
      return changed;
    }
    if (evt.type === 'PROFILE_DELETED') {
      const { name, email } = evt.payload;
      let changed = false;
      if (typeof AppState !== 'undefined' && Array.isArray(AppState.directory)) {
        const idx = AppState.directory.findIndex(d => (email && (d.email || '').toLowerCase() === email.toLowerCase()) || (name && d.name.toLowerCase() === name.toLowerCase()));
        if (idx !== -1) {
          AppState.directory.splice(idx, 1);
          changed = true;
        }
      }
      if (changed) {
        if (typeof saveAppData === 'function') saveAppData();
        if (typeof renderDirectory === 'function') renderDirectory();
        if (typeof renderBatchLeaderboard === 'function') renderBatchLeaderboard();
      }
      return changed;
    }
    if (evt.type === 'TEACHER_UPDATED' || evt.type === 'TEACHER_ENROLLED' || evt.type === 'TEACHER_TRIBUTE') {
      const tData = evt.payload;
      if (typeof AppState === 'undefined' || !Array.isArray(AppState.teachers)) return false;
      let changed = false;
      const existing = AppState.teachers.find(t =>
        (tData.id && String(t.id) === String(tData.id)) ||
        (tData.name && t.name.toLowerCase() === tData.name.toLowerCase())
      );
      if (existing) {
        if (tData.message && tData.message !== existing.message) { existing.message = tData.message; changed = true; }
        if (tData.photo && tData.photo !== existing.photo) { existing.photo = tData.photo; changed = true; }
        if (typeof tData.pranamCount === 'number' && tData.pranamCount > (existing.pranamCount || 0)) {
          existing.pranamCount = tData.pranamCount;
          changed = true;
        }
        if (Array.isArray(tData.tributes)) {
          if (!Array.isArray(existing.tributes)) existing.tributes = [];
          tData.tributes.forEach(tr => {
            if (!existing.tributes.some(x => (tr.id && x.id === tr.id) || (x.author === tr.author && x.text === tr.text))) {
              existing.tributes.push(tr);
              changed = true;
            }
          });
        }
      } else if (evt.type === 'TEACHER_ENROLLED' && tData.name) {
        AppState.teachers.unshift(tData);
        changed = true;
      }
      if (changed) {
        if (typeof saveAppData === 'function') saveAppData();
        if (typeof renderTeachers === 'function') renderTeachers();
      }
      return changed;
    }
    if (evt.type === 'AUDIT_LOG_CREATED' && evt.payload && evt.payload.id) {
      try {
        if (typeof localStorage !== 'undefined') {
          const key = 'JNVG_AUDIT_LOGS_V1';
          const logs = JSON.parse(localStorage.getItem(key) || '[]');
          if (!logs.some(l => l.id === evt.payload.id)) {
            logs.unshift(evt.payload);
            localStorage.setItem(key, JSON.stringify(logs.slice(0, 200)));
            if (typeof renderAuditLogs === 'function') renderAuditLogs();
            return true;
          }
        }
      } catch (e) {}
    }
    return false;
  }

  async function broadcastRegistration(userData) {
    return await publishEvent(REG_TOPIC, 'REGISTRATION_SUBMITTED', userData);
  }

  async function broadcastApproval(userObj) {
    return await publishEvent(REG_TOPIC, 'REGISTRATION_APPROVED', userObj);
  }

  async function broadcastProfileUpdate(userObj) {
    return await publishEvent(REG_TOPIC, 'PROFILE_UPDATED', userObj);
  }

  async function broadcastRoleUpdate(data) {
    return await publishEvent(REG_TOPIC, 'ROLE_UPDATED', data);
  }

  async function broadcastProfileDelete(data) {
    return await publishEvent(REG_TOPIC, 'PROFILE_DELETED', data);
  }

  async function broadcastTeacherUpdate(teacherObj, type = 'TEACHER_UPDATED') {
    return await publishEvent(REG_TOPIC, type, teacherObj);
  }

  async function syncRegistrations() {
    const events = await pollTopic(REG_TOPIC, 'all');
    let anyChanged = false;
    events.forEach(evt => {
      if (applyRegEvent(evt)) anyChanged = true;
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
        regEventSource.onmessage = async (e) => {
          try {
            const item = JSON.parse(e.data);
            const data = await parseNtfyItem(item);
            if (!data) return;
            const changed = applyRegEvent(data);
            if (changed && data.payload && data.payload.name) {
              console.log(`[CloudSync] Real-time sync (${data.type}) for ${data.payload.name}`);
            }
          } catch (err) {}
        };
      }
    } catch (e) {}
  }

  // ==========================================
  // 3. UNIVERSAL PLATFORM ACTIVITY SYNC
  // (RSVPs, Cultural Acts, Schedule, Donations, Helpdesk, Suggestions, Notable)
  // ==========================================

  function applyActivityEvent(evt) {
    if (typeof AppState === 'undefined' || !evt || !evt.type || !evt.payload) return false;
    const p = evt.payload;
    let changed = false;

    if (evt.type === 'RSVP_SUBMITTED') {
      if (!Array.isArray(AppState.rsvps)) AppState.rsvps = [];
      const exists = AppState.rsvps.some(r => (p.id && r.id === p.id) || (p.email && r.email && r.email.toLowerCase() === p.email.toLowerCase()));
      if (!exists) {
        AppState.rsvps.unshift(p);
        changed = true;
        if (typeof renderRsvpTable === 'function') renderRsvpTable();
      }
    } else if (evt.type === 'CULTURAL_ACT_SUBMITTED') {
      if (!Array.isArray(AppState.culturalActs)) AppState.culturalActs = [];
      if (!AppState.culturalActs.some(a => String(a.id) === String(p.id))) {
        AppState.culturalActs.unshift(p);
        changed = true;
        if (typeof renderCulturalActs === 'function') renderCulturalActs();
      }
    } else if (evt.type === 'CULTURAL_ACT_NOTES') {
      if (Array.isArray(AppState.culturalActs)) {
        const act = AppState.culturalActs.find(a => String(a.id) === String(p.actId));
        if (act && (act.notes !== p.notes || act.status !== p.status)) {
          if (p.notes !== undefined) act.notes = p.notes;
          if (p.status !== undefined) act.status = p.status;
          changed = true;
          if (typeof renderCulturalActs === 'function') renderCulturalActs();
        }
      }
    } else if (evt.type === 'SCHEDULE_ADDED') {
      if (!Array.isArray(AppState.meetSchedule)) AppState.meetSchedule = [];
      if (!AppState.meetSchedule.some(s => String(s.id) === String(p.id))) {
        AppState.meetSchedule.push(p);
        changed = true;
        if (typeof renderMeetSchedule === 'function') renderMeetSchedule();
      }
    } else if (evt.type === 'SCHEDULE_DELETED') {
      if (Array.isArray(AppState.meetSchedule)) {
        const idx = AppState.meetSchedule.findIndex(s => String(s.id) === String(p.eventId));
        if (idx !== -1) {
          AppState.meetSchedule.splice(idx, 1);
          changed = true;
          if (typeof renderMeetSchedule === 'function') renderMeetSchedule();
        }
      }
    } else if (evt.type === 'DONATION_SUBMITTED') {
      if (!Array.isArray(AppState.contributions)) AppState.contributions = [];
      if (!AppState.contributions.some(c => (p.id && c.id === p.id) || (p.utr && c.utr === p.utr))) {
        AppState.contributions.unshift(p);
        changed = true;
        if (typeof renderContributionLedger === 'function') renderContributionLedger();
      }
    } else if (evt.type === 'HELP_REQUEST_SUBMITTED') {
      if (!Array.isArray(AppState.helpRequests)) AppState.helpRequests = [];
      if (!AppState.helpRequests.some(h => String(h.id) === String(p.id))) {
        AppState.helpRequests.unshift(p);
        changed = true;
        if (typeof renderHelpRequests === 'function') renderHelpRequests();
        if (typeof renderAdminQueue === 'function') renderAdminQueue();
      }
    } else if (evt.type === 'HELP_REQUEST_NOTE') {
      if (Array.isArray(AppState.helpRequests)) {
        const req = AppState.helpRequests.find(h => String(h.id) === String(p.requestId));
        if (req && req.adminNotes !== p.adminNotes) {
          req.adminNotes = p.adminNotes;
          if (p.status) req.status = p.status;
          changed = true;
          if (typeof renderHelpRequests === 'function') renderHelpRequests();
        }
      }
    } else if (evt.type === 'NOTABLE_MESSAGE_SUBMITTED') {
      if (!Array.isArray(AppState.notableMessages)) AppState.notableMessages = [];
      if (!AppState.notableMessages.some(m => String(m.id) === String(p.id))) {
        AppState.notableMessages.unshift(p);
        changed = true;
        if (typeof renderNotableMessages === 'function') renderNotableMessages();
      }
    } else if (evt.type === 'SUGGESTION_SUBMITTED') {
      try {
        if (typeof localStorage !== 'undefined') {
          const key = 'JNVG_ADMIN_SUGGESTIONS_V1';
          const list = JSON.parse(localStorage.getItem(key) || '[]');
          if (!list.some(s => s.id === p.id || (s.text === p.text && s.author === p.author))) {
            list.unshift(p);
            localStorage.setItem(key, JSON.stringify(list));
            if (typeof renderAdminSuggestions === 'function') renderAdminSuggestions();
            changed = true;
          }
        }
      } catch (e) {}
    }

    if (changed && typeof saveAppData === 'function') {
      saveAppData();
    }
    return changed;
  }

  async function broadcastActivity(eventType, payload) {
    return await publishEvent(ACTIVITY_TOPIC, eventType, payload);
  }

  async function syncActivities() {
    const events = await pollTopic(ACTIVITY_TOPIC, 'all');
    let anyChanged = false;
    events.forEach(evt => {
      if (applyActivityEvent(evt)) anyChanged = true;
    });
    if (anyChanged) {
      console.log("[CloudSync] Platform activities synchronized across devices.");
    }
  }

  function startActivityStream() {
    try {
      if (activityEventSource) activityEventSource.close();
      if (typeof EventSource !== 'undefined') {
        activityEventSource = new EventSource(`${BASE_URL}/${ACTIVITY_TOPIC}/sse`);
        activityEventSource.onmessage = async (e) => {
          try {
            const item = JSON.parse(e.data);
            const data = await parseNtfyItem(item);
            if (data) applyActivityEvent(data);
          } catch (err) {}
        };
      }
    } catch (e) {}
  }

  // ==========================================
  // 4. CONFIDENTIAL CHAT MESSAGING SYNCHRONIZATION
  // ==========================================

  async function sendChatMessage(msg) {
    if (!msg || !msg.recipientName) return false;
    const topic = sanitizeTopic(msg.recipientName);
    return await publishEvent(topic, 'NEW_CHAT_MESSAGE', msg);
  }

  function getMyChatTopics(curUser) {
    const topics = [sanitizeTopic(curUser.name)];
    const isAdmin = curUser.role === 'admin' || (curUser.email && curUser.email.toLowerCase() === 'ashfaque15tr@gmail.com');
    if (isAdmin) {
      const alias = sanitizeTopic('JNVGFamily Admin');
      if (!topics.includes(alias)) topics.push(alias);
    }
    return topics;
  }

  async function syncChatMessages() {
    const curUser = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
    if (!curUser || !curUser.name || curUser.role === 'guest') return;

    const myTopics = getMyChatTopics(curUser);
    const allMsgs = (typeof getAllChatMessages === 'function') ? getAllChatMessages() : [];
    let hasNew = false;

    for (const myTopic of myTopics) {
      const events = await pollTopic(myTopic, 'all');
      events.forEach(evt => {
        if (evt.type === 'NEW_CHAT_MESSAGE' && evt.payload && evt.payload.id) {
          const m = evt.payload;
          const isAdmin = curUser.role === 'admin' || (curUser.email && curUser.email.toLowerCase() === 'ashfaque15tr@gmail.com');
          const isRecipient = (m.recipientName && m.recipientName.toLowerCase() === curUser.name.toLowerCase()) ||
                              (isAdmin && m.recipientName && m.recipientName.toLowerCase() === 'jnvgfamily admin') ||
                              (m.recipientId && m.recipientId === curUser.id);
          if (isRecipient && !allMsgs.some(existing => existing.id === m.id)) {
            allMsgs.push(m);
            hasNew = true;
          }
        }
      });
    }

    if (hasNew) {
      if (typeof saveAllChatMessages === 'function') saveAllChatMessages(allMsgs);
      if (typeof refreshInboxBadge === 'function') refreshInboxBadge();
      if (typeof renderChatConversations === 'function') renderChatConversations();
      if (typeof renderActiveChatMessages === 'function') renderActiveChatMessages();
      console.log("[CloudSync] Inbound chat messages synchronized.");
    }
  }

  function startChatStreamForTopic(topic, isPrimary) {
    try {
      if (typeof EventSource === 'undefined') return null;
      const es = new EventSource(`${BASE_URL}/${topic}/sse`);
      es.onmessage = async (e) => {
        try {
          const item = JSON.parse(e.data);
          const data = await parseNtfyItem(item);
          if (data && data.type === 'NEW_CHAT_MESSAGE' && data.payload) {
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
        } catch (err) {}
      };
      return es;
    } catch (e) {
      return null;
    }
  }

  function startChatStream() {
    const curUser = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
    if (!curUser || !curUser.name || curUser.role === 'guest') return;

    if (chatEventSource) chatEventSource.close();
    if (adminAliasChatEventSource) adminAliasChatEventSource.close();

    const myTopics = getMyChatTopics(curUser);
    chatEventSource = startChatStreamForTopic(myTopics[0], true);
    if (myTopics[1]) {
      adminAliasChatEventSource = startChatStreamForTopic(myTopics[1], false);
    }
  }

  async function syncAll() {
    await flushOutbox();
    await Promise.all([
      syncFeed(),
      syncRegistrations(),
      syncActivities(),
      syncChatMessages()
    ]);
  }

  /**
   * Master Initializer - Starts periodic sync and real-time streams
   */
  function init() {
    console.log("[CloudSync] Initializing JNV Alumni Universal Cloud Synchronization Engine...");

    // Flush any queued offline events and perform initial sync
    syncAll();

    // Start live SSE streams
    startFeedStream();
    startRegStream();
    startActivityStream();
    startChatStream();

    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('online', () => {
        console.log("[CloudSync] Network restored — flushing outbox & syncing...");
        syncAll();
      });
    }

    // Background interval sync every 12 seconds to guarantee cross-device consistency
    if (pollIntervalTimer) clearInterval(pollIntervalTimer);
    pollIntervalTimer = setInterval(() => {
      syncAll();
    }, 12000);
  }

  return {
    init,
    syncAll,
    flushOutbox,
    broadcastFeedPost,
    broadcastFeedLike,
    broadcastFeedComment,
    broadcastDeleteFeedPost,
    syncFeed,
    startFeedStream,
    broadcastRegistration,
    broadcastApproval,
    broadcastProfileUpdate,
    broadcastRoleUpdate,
    broadcastProfileDelete,
    broadcastTeacherUpdate,
    syncRegistrations,
    startRegStream,
    broadcastActivity,
    syncActivities,
    startActivityStream,
    sendChatMessage,
    syncChatMessages,
    startChatStream,
    publish: async (eventType, payload) => {
      if (eventType === 'AUDIT_LOG_CREATED') {
        return await publishEvent(REG_TOPIC, 'AUDIT_LOG_CREATED', payload);
      }
      return await publishEvent(ACTIVITY_TOPIC, eventType, payload);
    }
  };
})();

// Attach to global window
if (typeof window !== 'undefined') {
  window.AlumniCloudSync = AlumniCloudSync;
}
