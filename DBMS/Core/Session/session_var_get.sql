CREATE OR REPLACE FUNCTION adk_core.session_var_get (
  pdomain varchar,
  pname varchar
)
RETURNS text AS
$body$
declare

begin
  begin
    return current_setting('adk.' || pdomain || '.' || pname);
  exception
    when others then
      return null;
  end;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;
