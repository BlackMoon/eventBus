CREATE OR REPLACE FUNCTION adk_core.error_raise (
  pcode varchar,
  pmessage varchar,
  pdetail varchar,
  phint varchar
)
RETURNS void AS
$body$
declare

begin
  raise exception using
    message = pmessage
    , detail = pdetail
    , hint = phint
    , errcode = pcode
    , schema = current_schema();
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;
