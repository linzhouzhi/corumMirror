/**
 * Created by lzz on 2018/2/19.
 */

$(window).load(function () {
    init(window.flowData);
});

function init(flowData) {
    var $ = go.GraphObject.make;

    diagram =
        $(go.Diagram, "diagramDiv",
            {
                initialContentAlignment: go.Spot.Center,
                allowDrop: true,
                "LinkDrawn": showLinkLabel,
                "LinkRelinked": showLinkLabel,
                "animationManager.duration": 800,
                "undoManager.isEnabled": true
            });

    diagram.addDiagramListener("Modified", function(e) {
        var button = document.getElementById("SaveButton");
        if (button) button.disabled = !diagram.isModified;
        var idx = document.title.indexOf("*");
        if (diagram.isModified) {
            if (idx < 0) document.title += "*";
        } else {
            if (idx >= 0) document.title = document.title.substr(0, idx);
        }
    });


    function nodeStyle() {
        return [
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            {
                locationSpot: go.Spot.Center,
                //isShadowed: true,
                //shadowColor: "#888",
                // handle mouse enter/leave events to show/hide the ports
                mouseEnter: function (e, obj) { showPorts(obj.part, true); },
                mouseLeave: function (e, obj) { showPorts(obj.part, false); }
            }
        ];
    }

    function makePort(name, spot, output, input) {
        return $(go.Shape, "Circle",
            {
                fill: "transparent",
                stroke: null,
                desiredSize: new go.Size(8, 8),
                alignment: spot, alignmentFocus: spot,
                portId: name,
                fromSpot: spot, toSpot: spot,
                fromLinkable: output, toLinkable: input,
                cursor: "pointer"
            });
    }

    // Create an HTMLInfo and dynamically create some HTML to show/hide
    var customEditor = new go.HTMLInfo();
    var customSelectBox = document.createElement("select");

    customEditor.show = function(textBlock, diagram, tool) {
        if (!(textBlock instanceof go.TextBlock)) return;

        // Populate the select box:
        customSelectBox.innerHTML = "";

        var list = textBlock.choices;
        if( !list ){
            return;
        }
        for (var i = 0; i < list.length; i++) {
            var op = document.createElement("option");
            op.text = list[i];
            op.value = list[i];
            customSelectBox.add(op, null);
        }

        // After the list is populated, set the value:
        customSelectBox.value = textBlock.text;

        // Do a few different things when a user presses a key
        customSelectBox.addEventListener("keydown", function(e) {
            var keynum = e.which;
            if (keynum == 13) { // Accept on Enter
                tool.acceptText(go.TextEditingTool.Enter);
                return;
            } else if (keynum == 9) { // Accept on Tab
                tool.acceptText(go.TextEditingTool.Tab);
                e.preventDefault();
                return false;
            } else if (keynum === 27) { // Cancel on Esc
                tool.doCancel();
                if (tool.diagram) tool.diagram.focus();
            }
        }, false);

        var loc = textBlock.getDocumentPoint(go.Spot.TopLeft);
        var pos = diagram.transformDocToView(loc);
        customSelectBox.style.left = pos.x + "px";
        customSelectBox.style.top  = pos.y + "px";
        customSelectBox.style.position = 'absolute';
        customSelectBox.style.zIndex = 100; // place it in front of the Diagram

        diagram.div.appendChild(customSelectBox);
    }

    customEditor.hide = function(diagram, tool) {
        diagram.div.removeChild(customSelectBox);
    }

    customEditor.valueFunction = function() { return customSelectBox.value; }
    //diagram.toolManager.textEditingTool.defaultTextEditor = customEditor;

    var lightText = 'whitesmoke';
    var customMap = window.customComponents;
    for(var key in customMap){
        var choiceList = [];
        for(var i = 0; i < customMap[key].length; i++ ){
            var item = "#" + key + ":" + customMap[key][i];
            choiceList.push( item );
        }
        diagram.nodeTemplateMap.add("custom-" + key,
            $(go.Node, "Spot", nodeStyle(),
                $(go.Panel, "Auto",
                    $(go.Shape, "Rectangle",
                        { fill: "#00A9C9", stroke: null },
                        new go.Binding("figure", "figure")),
                    $(go.TextBlock,
                        {
                            font: "bold 10pt Helvetica, Arial, sans-serif",
                            stroke: lightText,
                            wrap: go.TextBlock.None,
                            editable: true,
                            margin: 8,
                            textEditor: customEditor,
                            choices: choiceList
                        },
                        new go.Binding("text").makeTwoWay())
                ),
                // four named ports, one on each side:
                makePort("T", go.Spot.Top, false, true),
                makePort("L", go.Spot.Left, true, true),
                makePort("R", go.Spot.Right, true, true),
                makePort("B", go.Spot.Bottom, true, false)
            ));
    }

    diagram.nodeTemplateMap.add("Component",
        $(go.Node, "Spot", nodeStyle(),
            $(go.Panel, "Auto",
                $(go.Shape, "Rectangle",
                    { fill: "#00A9C9", stroke: null },
                    new go.Binding("figure", "figure")),
                $(go.TextBlock,
                    {
                        font: "bold 10pt Helvetica, Arial, sans-serif",
                        stroke: lightText,
                        margin: 8,
                        width: 70,
                        textAlign: "center",
                        maxSize: new go.Size(460, NaN),
                        wrap: go.TextBlock.None,
                        editable: true
                    },
                    new go.Binding("text").makeTwoWay())
            ),
            // four named ports, one on each side:
            makePort("T", go.Spot.Top, false, true),
            makePort("L", go.Spot.Left, true, true),
            makePort("R", go.Spot.Right, true, true),
            makePort("B", go.Spot.Bottom, true, false)
        ));

    diagram.nodeTemplateMap.add("Code",
        $(go.Node, "Spot", nodeStyle(),
            $(go.Panel, "Auto",
                $(go.Shape, "Rectangle",
                    { fill: "#00A9C9", stroke: null },
                    new go.Binding("figure", "figure")),
                $(go.TextBlock,
                    {
                        font: "bold 10pt Helvetica, Arial, sans-serif",
                        stroke: lightText,
                        margin: 8,
                        maxSize: new go.Size(460, NaN),
                        wrap: go.TextBlock.WrapFit,
                        editable: true
                    },
                    new go.Binding("text").makeTwoWay())
            ),
            makePort("T", go.Spot.Top, false, true),
            makePort("L", go.Spot.Left, true, true),
            makePort("R", go.Spot.Right, true, true),
            makePort("B", go.Spot.Bottom, true, false)
        ));

    diagram.nodeTemplateMap.add("Start",
        $(go.Node, "Spot", nodeStyle(),
            $(go.Panel, "Auto",
                $(go.Shape, "Circle",
                    { minSize: new go.Size(40, 40), fill: "#79C900", stroke: null }),
                $(go.TextBlock, "Start",
                    { font: "bold 8pt Helvetica, Arial, sans-serif", stroke: lightText },
                    new go.Binding("text"))
            ),

            makePort("L", go.Spot.Left, true, false),
            makePort("R", go.Spot.Right, true, false),
            makePort("B", go.Spot.Bottom, true, false)
        ));

    diagram.nodeTemplateMap.add("End",
        $(go.Node, "Spot", nodeStyle(),
            $(go.Panel, "Auto",
                $(go.Shape, "Circle",
                    { minSize: new go.Size(40, 40), fill: "#DC3C00", stroke: null }),
                $(go.TextBlock, "End",
                    { font: "bold 8pt Helvetica, Arial, sans-serif", stroke: lightText },
                    new go.Binding("text"))
            ),
            makePort("T", go.Spot.Top, false, true),
            makePort("L", go.Spot.Left, false, true),
            makePort("R", go.Spot.Right, false, true)
        ));

    diagram.nodeTemplateMap.add("Comment",
        $(go.Node, "Auto", nodeStyle(),
            $(go.Shape, "File",
                { fill: "rgba(102, 210, 230, 0.25)", stroke: null }),
            $(go.TextBlock,
                {
                    margin: 5,
                    maxSize: new go.Size(200, NaN),
                    wrap: go.TextBlock.WrapFit,
                    textAlign: "center",
                    editable: true,
                    font: "Arial",
                    stroke: '#454545'
                },
                new go.Binding("text").makeTwoWay())
        ));

    diagram.linkTemplate =
        $(go.Link,
            {
                routing: go.Link.AvoidsNodes,
                curve: go.Link.JumpOver,
                corner: 5, toShortLength: 4,
                relinkableFrom: true,
                relinkableTo: true,
                reshapable: true,
                resegmentable: true,

                mouseEnter: function(e, link) { link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)"; },
                mouseLeave: function(e, link) { link.findObject("HIGHLIGHT").stroke = "transparent"; }
            },
            new go.Binding("points").makeTwoWay(),
            $(go.Shape,
                { isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),
            $(go.Shape,
                { isPanelMain: true, stroke: "gray", strokeWidth: 2 }),
            $(go.Shape,
                { toArrow: "standard", stroke: null, fill: "gray"}),
            $(go.Panel, "Auto",
                { visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5},
                new go.Binding("visible", "visible").makeTwoWay(),
                $(go.Shape, "RoundedRectangle",
                    { fill: "#F8F8F8", stroke: null }),
                $(go.TextBlock, "Yes",
                    {
                        textAlign: "center",
                        font: "10pt helvetica, arial, sans-serif",
                        stroke: "#333333",
                        editable: true
                    },
                    new go.Binding("text").makeTwoWay())
            )
        );

    function showLinkLabel(e) {
        var label = e.subject.findObject("LABEL");
        if (label !== null) label.visible = (e.subject.fromNode.data.figure === "Diamond");
    }

    diagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
    diagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;

    load();

    palette =
        $(go.Palette, "paletteDiv",
            {
                "animationManager.duration": 800,
                nodeTemplateMap: diagram.nodeTemplateMap,
                model: new go.GraphLinksModel([
                    { category: "Start", text: "Start" },
                    { category: "Code", text: "Step" },
                    { category: "Code", text: "if", figure: "Diamond" },
                    { category: "End", text: "End" },
                    { category: "Comment", text: "Comment" }
                ])
            });
    paletteComponent =
        $(go.Palette, "paletteComponent",
            {
                "animationManager.duration": 800,
                nodeTemplateMap: diagram.nodeTemplateMap,
                model: new go.GraphLinksModel([
                    { category: "Component", text: "Redis" },
                    { category: "Component", text: "Hbase" },
                    { category: "Component", text: "Kafka" },
                    { category: "Component", text: "SqlServer" },
                    { category: "Component", text: "Mysql" },
                    { category: "Component", text: "Http" }
                ])
            });

    var constomPaletteList = [];
    for(var key in customMap){
        var item = { category: "custom-" + key, text: key, key: key.substring(0, 10) };
        constomPaletteList.push( item );
    }
    paletteUserCustom =
        $(go.Palette, "paletteUserCustom",
            {
                "animationManager.duration": 800,
                model: new go.GraphLinksModel( constomPaletteList )
            });
    paletteUserCustom.nodeTemplate =
        $(go.Node, "Spot", nodeStyle(),
            $(go.Panel, "Auto",
                $(go.Shape, "Rectangle",
                    { fill: "#00A9C9", stroke: null },
                    new go.Binding("figure", "figure")),
                $(go.TextBlock,
                    {
                        font: "bold 10pt Helvetica, Arial, sans-serif",
                        stroke: lightText,
                        margin: 8,
                        width: 70,
                        textAlign: "center",
                        wrap: go.TextBlock.None
                    },
                    new go.Binding("text","key"))
            )
        );

    function customFocus() {
        var x = window.scrollX || window.pageXOffset;
        var y = window.scrollY || window.pageYOffset;
        go.Diagram.prototype.doFocus.call(this);
        window.scrollTo(x, y);
    }

    diagram.doFocus = customFocus;
    palette.doFocus = customFocus;
    paletteComponent.doFocus = customFocus;
    paletteUserCustom.doFocus = customFocus;
    selectListener(diagram);
    initComponent(diagram);
}

function getSelect() {
    if( window.select_Port == null ){
        return null;
    }
    return window.select_Port.Vd.key;
}

function showPorts(node, show) {
    var diagram = node.diagram;
    if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
    node.ports.each(function(port) {
        port.stroke = (show ? "white" : null);
    });
}


function load() {
    var data = { "class": "go.GraphLinksModel",
        "linkFromPortIdProperty": "fromPort",
        "linkToPortIdProperty": "toPort",
        "linkDataArray":[],
        "nodeDataArray":[]
        };
        data.linkDataArray = flowData.linkDataArray;
        data.nodeDataArray = flowData.nodeDataArray;
    diagram.model = go.Model.fromJson(data);
}

// add an SVG rendering of the diagram at the end of this page
function makeSVG() {
    var svg = diagram.makeSvg({
        scale: 0.5
    });
    svg.style.border = "1px solid black";
    obj = document.getElementById("SVGArea");
    obj.appendChild(svg);
    if (obj.children.length > 0) {
        obj.replaceChild(svg, obj.children[0]);
    }
}