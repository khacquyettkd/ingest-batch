#solar ingest:

##insert:
-Endpoint: ingest.solar-gps.com/solar
-Method: 'POST'
-Request body: 
{
    "deviceId": number,
    "apiKey": string,
    "table": string,
    "brand": string,
    "data": object{"column_name":value,...}, //full columns
}
##update:
-method: 'PATCH'
-body: {
    "deviceId": number,
    "apiKey": string,
    "table": string,
    "brand": string,
    "condition": array([
        { 
            "field": string, 
            "operator": '=' | '>' | '<' | '>=' | '<=' | '!=', 
            "value: string | number | boolean
        },
        ...
    ]), 
    "update": array([
        {
            "field": string, 
            "value: string | number | boolean
        },
        ...
    ])
}