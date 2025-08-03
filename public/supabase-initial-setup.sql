-- Users table
CREATE TABLE users (
  id VARCHAR PRIMARY KEY,
  name VARCHAR,
  real_name VARCHAR,
  email VARCHAR,
  display_name VARCHAR,
  title VARCHAR,
  phone VARCHAR,
  image_original VARCHAR,
  is_admin BOOLEAN,
  is_owner BOOLEAN,
  is_deleted BOOLEAN,
  updated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Channels table  
CREATE TABLE channels (
  id VARCHAR PRIMARY KEY,
  name VARCHAR,
  is_channel BOOLEAN,
  is_group BOOLEAN,
  is_im BOOLEAN,
  is_mpim BOOLEAN,
  is_private BOOLEAN,
  is_archived BOOLEAN,
  creator VARCHAR REFERENCES users(id),
  topic_value TEXT,
  purpose_value TEXT,
  member_count INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  ts VARCHAR PRIMARY KEY,
  channel_id VARCHAR REFERENCES channels(id),
  user_id VARCHAR REFERENCES users(id),
  text TEXT,
  message_type VARCHAR,
  subtype VARCHAR,
  thread_ts VARCHAR,
  reply_count INTEGER,
  reply_users_count INTEGER,
  client_msg_id VARCHAR,
  has_attachments BOOLEAN,
  has_reactions BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Reactions table
CREATE TABLE reactions (
  id SERIAL PRIMARY KEY,
  message_ts VARCHAR REFERENCES messages(ts),
  name VARCHAR,
  count INTEGER,
  users TEXT[], -- Array of user IDs
  created_at TIMESTAMP DEFAULT NOW()
);

-- Files table
CREATE TABLE files (
  id VARCHAR PRIMARY KEY,
  name VARCHAR,
  title VARCHAR,
  mimetype VARCHAR,
  filetype VARCHAR,
  size INTEGER,
  url_private VARCHAR,
  user_id VARCHAR REFERENCES users(id),
  channels TEXT[], -- Array of channel IDs
  created_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Channel members table
CREATE TABLE channel_members (
  channel_id VARCHAR REFERENCES channels(id),
  user_id VARCHAR REFERENCES users(id),
  joined_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (channel_id, user_id)
);
