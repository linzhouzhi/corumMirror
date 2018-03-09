/**
 * Created by lzz on 2018/2/19.
 */


function init() {
    if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
    var $ = go.GraphObject.make;  // for conciseness in defining templates

    diagram =
        $(go.Diagram, "diagramDiv",  // must name or refer to the DIV HTML element
            {
                initialContentAlignment: go.Spot.Center,
                allowDrop: true,  // must be true to accept drops from the Palette
                "LinkDrawn": showLinkLabel,  // this DiagramEvent listener is defined below
                "LinkRelinked": showLinkLabel,
                "animationManager.duration": 800, // slightly longer than default (600ms) animation
                "undoManager.isEnabled": true  // enable undo redo
            });

    // when the document is modified, add a "*" to the title and enable the "Save" button
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

    // helper definitions for node templates

    function nodeStyle() {
        return [
            // The Node.location comes from the "loc" property of the node data,
            // converted by the Point.parse static method.
            // If the Node.location is changed, it updates the "loc" property of the node data,
            // converting back using the Point.stringify static method.
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            {
                // the Node.location is at the center of each node
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
                stroke: null,  // this is changed to "white" in the showPorts function
                desiredSize: new go.Size(8, 8),
                alignment: spot, alignmentFocus: spot,  // align the port on the main Shape
                portId: name,  // declare this object to be a "port"
                fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
                fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
                cursor: "pointer"  // show a different cursor to indicate potential link point
            });
    }

    // define the Node templates for regular nodes

    var lightText = 'whitesmoke';

    diagram.nodeTemplateMap.add("Code",  // the default category
        $(go.Node, "Spot", nodeStyle(),
            // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
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
            // four named ports, one on each side:
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
            // three named ports, one on each side except the top, all output only:
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
            // three named ports, one on each side except the bottom, all input only:
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
            // no ports, because no links are allowed to connect with a comment
        ));


    // replace the default Link template in the linkTemplateMap
    diagram.linkTemplate =
        $(go.Link,  // the whole link panel
            {
                routing: go.Link.AvoidsNodes,
                curve: go.Link.JumpOver,
                corner: 5, toShortLength: 4,
                relinkableFrom: true,
                relinkableTo: true,
                reshapable: true,
                resegmentable: true,
                // mouse-overs subtly highlight links:
                mouseEnter: function(e, link) { link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)"; },
                mouseLeave: function(e, link) { link.findObject("HIGHLIGHT").stroke = "transparent"; }
            },
            new go.Binding("points").makeTwoWay(),
            $(go.Shape,  // the highlight shape, normally transparent
                { isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),
            $(go.Shape,  // the link path shape
                { isPanelMain: true, stroke: "gray", strokeWidth: 2 }),
            $(go.Shape,  // the arrowhead
                { toArrow: "standard", stroke: null, fill: "gray"}),
            $(go.Panel, "Auto",  // the link label, normally not visible
                { visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5},
                new go.Binding("visible", "visible").makeTwoWay(),
                $(go.Shape, "RoundedRectangle",  // the label shape
                    { fill: "#F8F8F8", stroke: null }),
                $(go.TextBlock, "Yes",  // the label
                    {
                        textAlign: "center",
                        font: "10pt helvetica, arial, sans-serif",
                        stroke: "#333333",
                        editable: true
                    },
                    new go.Binding("text").makeTwoWay())
            )
        );

    // Make link labels visible if coming out of a "conditional" node.
    // This listener is called by the "LinkDrawn" and "LinkRelinked" DiagramEvents.
    function showLinkLabel(e) {
        var label = e.subject.findObject("LABEL");
        if (label !== null) label.visible = (e.subject.fromNode.data.figure === "Diamond");
    }

    // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
    diagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
    diagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;

    load();  // load an initial diagram from some JSON text加载原有流程

    // initialize the Palette that is on the left side of the page
    palette =
        $(go.Palette, "paletteDiv",  // must name or refer to the DIV HTML element
            {
                "animationManager.duration": 800, // slightly longer than default (600ms) animation
                nodeTemplateMap: diagram.nodeTemplateMap,  // share the templates used by diagram
                model: new go.GraphLinksModel([  // specify the contents of the Palette
                    { category: "Start", text: "Start" },
                    { category: "Code", text: "Step" },
                    { category: "Code", text: "if", figure: "Diamond" },
                    { category: "End", text: "End" },
                    { category: "Comment", text: "Comment" }
                ])
            });

    // The following code overrides GoJS focus to stop the browser from scrolling
    // the page when either the Diagram or Palette are clicked or dragged onto.

    function customFocus() {
        var x = window.scrollX || window.pageXOffset;
        var y = window.scrollY || window.pageYOffset;
        go.Diagram.prototype.doFocus.call(this);
        window.scrollTo(x, y);
    }

    diagram.doFocus = customFocus;
    palette.doFocus = customFocus;

    window.select_Port = null;
    diagram.addDiagramListener("ObjectSingleClicked", function(e) {
        window.select_Port = e.subject.part;

    });
    diagram.addDiagramListener("ObjectContextClicked", function(e) {
        window.select_Port = e.subject.part;

    });

    diagram.addDiagramListener("BackgroundSingleClicked", function(e) {
        window.select_Port = null;
    });
    diagram.addDiagramListener("BackgroundDoubleClicked", function(e) {
        window.select_Port = null;
    });
    diagram.addDiagramListener("BackgroundContextClicked", function(e) {
        window.select_Port = null;
    });


} // end init

function getSelect() {
    if( window.select_Port == null ){
        return null;
    }
    return window.select_Port.Vd.key;
}
// Make all ports on a node visible when the mouse is over the node
function showPorts(node, show) {
    var diagram = node.diagram;
    if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
    node.ports.each(function(port) {
        port.stroke = (show ? "white" : null);
    });
}


/*  // Show the diagram's model in JSON format that the user may edit
 function save() {
 document.getElementById("mySavedModel").value = diagram.model.toJson();
 diagram.isModified = false;
 }*/
function load() {
    var data = { "class": "go.GraphLinksModel",
        "linkFromPortIdProperty": "fromPort",
        "linkToPortIdProperty": "toPort",
        "linkDataArray":[],
        "nodeDataArray":[]
        };
        data.linkDataArray = window.flowData.linkDataArray;
        data.nodeDataArray = window.flowData.nodeDataArray;
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