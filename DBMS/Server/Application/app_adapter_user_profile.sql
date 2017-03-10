CREATE TABLE adk_application.app_adapter_user_profile (
  application_adapter_id adk_core.object_id NOT NULL,
  user_id adk_core.object_id NOT NULL,
  login VARCHAR(255) NOT NULL,
  password VARCHAR(255),
  CONSTRAINT app_adapter_user_profile_pk PRIMARY KEY(application_adapter_id, user_id),
  CONSTRAINT app_adapter_user_profile_adapter_id_fk FOREIGN KEY (application_adapter_id)
    REFERENCES adk_application.application_adapters(id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT app_adapter_user_profile_user_id_fk FOREIGN KEY (user_id)
    REFERENCES adk_user.users(id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
)
WITH (oids = false);
