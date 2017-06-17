$(document).ready(function () {
    $('#calculate').click(onCalculateClick);
    $('#startDate').datepicker();

     function onCalculateClick() {
        var days = $('#days').val();
        var start_date = $('#startDate').val();
        var end_date = moment(start_date, "MM/DD/YYYY").add('days', days);
        var country_code = $("#countryCode").val(); 
        
        if (!isValid(days, start_date, country_code)) return;

        clearResults();
        drawCalendars(start_date, end_date);
    }

    function isValid(days, start_date, country_code){
        var message = "";
        if (!days || isNaN(days) || days < 1) message = "You must enter a valid number of days\n";
        if (!start_date) message += "You must select a start date\n";
        if (!country_code) message += "You must enter a country code";
        if (message.length > 0){
            alert(message);
            return false;
        }
        return true;    
    }

    function clearResults(){
        $("#results").empty();
    }

    function drawCalendars(start_date, end_date) {
        var startFirstDay = moment(start_date).startOf('month');
        var endFirstDay = moment(end_date).startOf('month');

        var i = 0;
        while (moment(startFirstDay).isSameOrBefore(endFirstDay)) {
            i++;
            var calendarId = "calendar" + i;
            $("<div id='" + calendarId + "' />").appendTo("#results");
            $('#' + calendarId).datepicker(setupDatePicker(start_date, end_date, startFirstDay));
            startFirstDay = moment(startFirstDay).add(1, 'months');
        }
    }

    function setupDatePicker(startDate, endDate, defaultDate) {
        return {
            defaultDate: moment(defaultDate).toDate(),
            hideIfNoPrevNext: true,//not working
            beforeShowDay: function (date) {
                if (moment(date).isBetween(startDate, endDate, 'day', '[)')) {
                    if (isHoliday(date))
                        return [true, "holiday", '']; //orange
                    if (isWeekend(date))
                        return [true, "weekend", '']; //yellow
                    return [true, "weekday", '']; //green olive
                }
                return [false, 'invalid', ''];//gray
            }
        };
    }

     function isHoliday(currentDate) {
        return false;
    }

    function isWeekend(currentDate) {
        var day = moment(currentDate).day();
        return day == 0 || day == 6;
    }
});