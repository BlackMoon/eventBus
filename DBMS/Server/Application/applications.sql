CREATE TABLE adk_application.applications (
  id adk_core.object_id DEFAULT adk_core.object_id_make(adk_application.application_type_id(), nextval('adk_application.applications_id_seq'::regclass)::adk_core.object_local_id) NOT NULL,
  name VARCHAR(1024) NOT NULL,
  caption VARCHAR(1024) NOT NULL,
  active BOOLEAN DEFAULT false,
  CONSTRAINT applications_name_key UNIQUE(name),
  CONSTRAINT applications_pkey PRIMARY KEY(id)
)
WITH (oids = false);
