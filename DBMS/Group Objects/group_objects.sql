CREATE TABLE adk_group_objects.group_objects (
  group_id adk_core.object_id NOT NULL,
  object_id adk_core.object_id NOT NULL,
  CONSTRAINT group_objects_pkey PRIMARY KEY(group_id, object_id),
  CONSTRAINT group_objects_group_fk FOREIGN KEY (group_id)
    REFERENCES adk_group_objects.groups(id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT group_objects_object_fk FOREIGN KEY (object_id)
    REFERENCES adk_group_objects.groups(id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
)
WITH (oids = false);

CREATE UNIQUE INDEX group_objects_idx1 ON adk_group_objects.group_objects
  USING btree (object_id COLLATE pg_catalog."default", group_id COLLATE pg_catalog."default");
