PL/SQL Developer Test script 3.0
11
declare
  xtoken adk$event_bus_connector.t_token;
begin
  -- Call the function
  adk$event_bus_connector.service_login(
    pservice_name => 'develop'
    , puser_name => :puser_name
    , ppassword => :ppassword
    , ptoken => xtoken);

end;
3
result
1
1
-3
puser_name
1
test
5
ppassword
1
test
5
1
ptoken_info.data.token
