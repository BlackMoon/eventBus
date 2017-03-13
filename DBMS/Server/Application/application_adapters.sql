CREATE TABLE adk_application.application_adapters (
  id adk_core.object_id DEFAULT adk_core.object_id_make(adk_application.application_adapter_type_id(), nextval('adk_application.application_adapters_id_seq'::regclass)::adk_core.object_local_id) NOT NULL,
  application_id adk_core.object_id NOT NULL,
  name VARCHAR(1024) NOT NULL,
  type adk_application.application_adapter_type NOT NULL,
  settings TEXT,
  CONSTRAINT application_adapters_pkey PRIMARY KEY(id),
  CONSTRAINT application_adapters_application_id_fk FOREIGN KEY (application_id)
    REFERENCES adk_application.applications(id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
)
WITH (oids = false);
