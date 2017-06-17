$(document).ready(function () {
    $('#calculate').click(onCalculateClick);
    $('#startDate').datepicker();

    function onCalculateClick() {
        var days = $('#days').val();
        var start_date = $('#startDate').val();
        var end_date = moment(start_date, "MM/DD/YYYY").add('days', days);
        var country_code = $("#countryCode").val(); 
        
        clearResults();
        
        if (!isValid(days, start_date, country_code)) return;

        getHolidays(country_code)
            .done(function(data){
                drawCalendars(start_date, end_date, data.holidays);
            })
            .fail(function(){
                alert("An error has ocurred calling Holidays API");
            });
    }

    function getHolidays(country_code){
        return $.ajax({
            method: "GET",
            url: "https://holidayapi.com/v1/holidays",
            data: {
                key: "902627f9-2670-41bb-b4ae-1415ca24eabb",
                country: country_code,
                year: "2008"
            }
        });
    }

    function isValid(days, start_date, country_code){
        var message = "";
        if (!days || isNaN(days) || days < 1) message = "You must enter a valid number of days\n";
        if (!start_date) message += "You must select a start date\n";
        if (!country_code || getSupportedCountryCodes().indexOf(country_code.toUpperCase()) < 0) message += "You must enter a country code";
        if (message.length > 0){
            alert(message);
            return false;
        }
        return true;    
    }

    function clearResults(){
        $("#results").empty();
    }

    function drawCalendars(start_date, end_date, holidays) {
        var startFirstDay = moment(start_date).startOf('month');
        var endFirstDay = moment(end_date).startOf('month');

        var i = 0;
        while (moment(startFirstDay).isSameOrBefore(endFirstDay)) {
            i++;
            var calendarId = "calendar" + i;
            $("<div id='" + calendarId + "' />").appendTo("#results");
            $('#' + calendarId).datepicker(setupDatePicker(start_date, end_date, startFirstDay, holidays));
            startFirstDay = moment(startFirstDay).add(1, 'months');
        }
    }

    function setupDatePicker(startDate, endDate, defaultDate, holidays) {
        return {
            defaultDate: moment(defaultDate).toDate(),
            hideIfNoPrevNext: true,//not working
            beforeShowDay: function (date) {
                if (moment(date).isBetween(startDate, endDate, 'day', '[)')) {
                    if (isHoliday(date, holidays)){
                        var holiday = holidays[moment(date).format("YYYY-MM-DD")];
                        return [true, "holiday", holiday[0].name];
                    }
                    if (isWeekend(date))
                        return [true, "weekend", ''];
                    return [true, "weekday", ''];
                }
                return [false, 'invalid', ''];
            }
        };
    }

    function isHoliday(currentDate, holidays) {
        var formattedDate = moment(currentDate).format("YYYY-MM-DD");
        return holidays[formattedDate] != undefined;
    }

    function isWeekend(currentDate) {
        var day = moment(currentDate).day();
        return day == 0 || day == 6;
    }

    function getSupportedCountryCodes(){
        return ["AR","BG", "BO", "BR", "CA", "CH",
         "CN", "CO", "EC", "ES", "FR", "GB", 
         "IT", "JP", "MX", "NL", "PE", "PR",
         "PT", "PY", "RU", "US", "UY", "VE"];
    }
});