const inputElement = document.getElementById("input");
inputElement.addEventListener("change", async () => {
    let rawData = JSON.parse(await inputElement.files[0].text())
    const messages = rawData.messages

    let dates = {}
    let [splitFirstDate, _] = messages[0].date.split("T")
    let firstDate = new Date(splitFirstDate).getTime()

    messages.forEach(message => {
        let [date, time] = message.date.split("T")
        let thisMessageDate = new Date(date).getTime()

        if (!(thisMessageDate in dates)) {
            dates[thisMessageDate] = 1
        } else {
            dates[thisMessageDate] += 1
        }
    })

    let formattedData = [
        ['Day', 'Messages'],
    ]

    for (let date in dates) {
        let difference = date - firstDate

        let daysDifference = difference / (1000 * 60 * 60 * 24);
        formattedData.push([daysDifference, dates[date]])
    }

    google.charts.load('current', {'packages':['line']});
    google.charts.setOnLoadCallback(_ => {
        let data = google.visualization.arrayToDataTable(formattedData)

        var options = {
          title: 'Telegram group popularity',
          curveType: 'function',
          legend: { position: 'bottom' }
        }     

        var chart = new google.charts.Line(document.getElementById('line_chart'))
        
        chart.draw(data, options)
    })
}, false)
