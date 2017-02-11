CREATE TABLE adk_user.users (
  id adk_core.object_id DEFAULT adk_core.object_id_make(adk_user.user_type_id(), nextval('adk_user.users_id_seq'::regclass)::adk_core.object_local_id) NOT NULL,
  login VARCHAR(255) NOT NULL,
  name VARCHAR(1024) NOT NULL,
  active BOOLEAN DEFAULT false NOT NULL,
  CONSTRAINT users_login_key UNIQUE(login),
  CONSTRAINT users_name_key UNIQUE(name),
  CONSTRAINT users_pkey PRIMARY KEY(id)
)
WITH (oids = false);
