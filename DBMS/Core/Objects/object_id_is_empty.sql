CREATE OR REPLACE FUNCTION adk_core.object_id_is_empty (
  pobject_id adk_core.object_id
)
RETURNS boolean AS
$body$
declare
  xobject_type_id adk_core.object_type_id;
  xobject_local_id adk_core.object_local_id;
begin
  if pobject_id is null then
    return true;
  end if;
  begin
    xobject_type_id := adk_core.object_id_to_type_id(pobject_id);
    xobject_local_id := adk_core.object_id_to_local_id(pobject_id);
    if xobject_local_id > 0 and xobject_local_id > 0 then
      return false;
    else
      return true;
    end if;
  exception
    when others then
      return false;
  end;
end;
$body$
LANGUAGE 'plpgsql'
IMMUTABLE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;
