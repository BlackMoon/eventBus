CREATE TYPE adk_core.error AS (
  id adk_core.object_local_id,
  code INTEGER,
  text VARCHAR(1024),
  details VARCHAR(2048)
);
