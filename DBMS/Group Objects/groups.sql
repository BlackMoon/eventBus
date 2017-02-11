CREATE TABLE adk_group_objects.groups (
  id adk_core.object_id DEFAULT adk_core.object_id_make(adk_group_objects.group_type_id(), nextval('adk_group_objects.groups_id_seq'::regclass)::adk_core.object_local_id) NOT NULL,
  name VARCHAR(512) NOT NULL,
  description VARCHAR(2048),
  CONSTRAINT groups_pkey PRIMARY KEY(id)
)
WITH (oids = false);

CREATE INDEX groups_idx_name_upper ON adk_group_objects.groups
  USING btree ((upper((name)::text)) COLLATE pg_catalog."default");
