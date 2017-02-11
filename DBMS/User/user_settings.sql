CREATE TABLE adk_user.user_settings (
  user_id adk_core.object_id NOT NULL,
  domain VARCHAR(512) NOT NULL,
  name VARCHAR(512) NOT NULL,
  value TEXT,
  CONSTRAINT user_settings_pkey PRIMARY KEY(user_id, domain, name),
  CONSTRAINT user_settings_user_id_fk FOREIGN KEY (user_id)
    REFERENCES adk_user.users(id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
)
WITH (oids = false);
