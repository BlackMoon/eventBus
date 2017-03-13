CREATE OR REPLACE FUNCTION adk_user.user_type_id (
)
RETURNS adk_core.object_type_id AS
$body$
declare

begin
  return 500;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;
