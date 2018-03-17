/**
 * Created by lzz on 2018/2/27.
 */

function initComponent(diagram) {
    diagram.addDiagramListener("ExternalObjectsDropped", function (e) {
        try {
            e.subject.each(function(part) {
                var text = part.Vd.text;
                if( text == "Redis" ) {
                    part.Vd.text = "function f1(param){ \n"+
                    "console.log(param); \n"+
                    "console.log('f111'); \n"+
                    "return {'aa':123,'cc':90}; \n"+
                    "}";
                }

                if( part.Vd.category == "Component"){
                    part.Vd.category = "Code";
                    diagram.rebuildParts();
                }
            });
        }catch (e) {
            console.log(e);
        }
    });
}

function show_table(data) {
    $("#flow-chart-result").html('<div id="flow-result-table"></div>');
    var table_str = "";
    var table_head = "";
    for(var i=0; i < data.length; i++){
        table_str += "<tr>";
        table_head = "<tr>";
        for(var key in data[i]){
            table_head += "<th>" + key + "</th>";
            table_str += "<td>" + data[i][key] + "</td>"
        }
        table_head += "</tr>";
        table_str += "</tr>";
    }
    table_str = "<table class='table table-bordered'>" + table_head + table_str + "</table>";
    $("#flow-result-table").html( table_str );
}

function show_bar(data) {
    $("#flow-chart-result").html('<canvas id="flow-result-chart" style="height:400px"></canvas>');
    var ctx = document.getElementById("flow-result-chart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
}
