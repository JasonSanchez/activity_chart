var chart_utils = {};

(function(self){
    self.activity_colors = {
        "Sitting": "rgba(72,255,32,.75)",
        "Deep breathing for 30 seconds": "rgba(71,19,255,.75)",
        "Standing": "rgba(17,216,232,.75)",
        "30 jumping jacks": "rgba(255,91,32,.75)"};

    // Make svg canvas
    /**
    Create a new SVG canvas with margin padding
    built in.

    @param {number} height - The height of the svg
                             canvas (without the
                             padding)

    @param {number} width - The width of the svg
                            canvas (without the
                            padding)
    */
    self.make_svg = function(height,
                            width,
                            top_margin,
                            bottom_margin,
                            right_margin,
                            left_margin) {
            var x_adjust = right_margin + left_margin;
            var y_adjust = top_margin + bottom_margin;
            var translate = "translate(" + left_margin + ", "
                                         + top_margin + ")"
            return d3.select("body")
                    .append("svg")
                    .attr("height", height + y_adjust)
                    .attr("width", width + x_adjust)
                    .append("g")
                    .attr("transform", translate);
                };

    self.make_y_labels = function(svg,
                                 label_text,
                                 left_margin,
                                 height,
                                 css_class="chart_labels"){

            var translate_y_label = "translate("
                                     + -left_margin*.95
                                     + ", "
                                     + height/2
                                     + ") rotate(270)";

            svg.append("text")
                    .text(label_text)
                    .attr("class", css_class)
                    .attr("transform", translate_y_label)
                    .attr("text-anchor", "middle")
                    .attr("alignment-baseline", "hanging");
                };

    // Add lines to chart
    self.add_lines = function(data,
                             svg,
                             var_list,
                             scale_x,
                             scale_y,
                             line_color){
        for (v of var_list){
            var line = d3.line()
                    .x(function(d, i){return scale_x(i);})
                    .y(function(d){
                        var measure = d[v];
                        var scaled_measure = scale_y(measure);
                        return scaled_measure;});

            var line_chart = svg.append("path")
                    .attr("class", "linechart")
                    .style("stroke", line_color)
                    .attr("d", line(data))
                    ;}
                };

    self.make_line_chart = function(data,
                                   height_of_svg,
                                   var_list,
                                   scale_y,
                                   chart_title,
                                   y_label,
                                   line_color
                                   ) {
       // Get axis labels
       var axis_labels = [];
       for (value of data) {
           var activity = value["Activity"];
           axis_labels.push(activity);
       };

       // Chart dimensions
       var height = height_of_svg,
           width = height*3,
           top_margin = height*.2,
           bottom_margin = height*.35,
           right_margin = width*.05,
           left_margin = width*.11;

        // Scaling
        var scale_x = d3.scaleLinear()
                .domain([0, 17])
                .range([0, width]);

        var svg = self.make_svg(height,
                width,
                top_margin,
                bottom_margin,
                right_margin,
                left_margin);

        self.add_lines(data,
                svg,
                var_list,
                scale_x,
                scale_y,
                line_color);

        // x-axis
        var x_translate = "translate(0, " + height + ")";
        var x_axis = svg.append("g")
                .attr("class", "axis")
                .attr("transform", x_translate)
                .call(d3.axisBottom(scale_x)
                        .tickFormat(function(d){return axis_labels[d];})
                        .ticks(20))
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-65)" );;

        // y-axis
        var y_axis = svg.append("g")
                .attr("class", "axis")
                .call(d3.axisLeft(scale_y)
                        .ticks(5));

        // title
        svg.append("text")
                .text(chart_title)
                .attr("class", "chart_title")
                .attr("x", width/2)
                .attr("y", -height*.05);

        // x-labels
        svg.append("text")
                .text("Seconds holding breath")
                .attr("class", "chart_labels")
                .attr("x", width/2)
                .attr("y", height + bottom_margin)
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "text-after-edge");

        // y-labels
        self.make_y_labels(svg, y_label, left_margin, height);

        // border
        var borderPath = svg.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("height", height)
                .attr("width", width)
                .style("stroke", "black")
                .style("fill", "none")
                .style("stroke-width", 1);

        return svg;
    };

}(chart_utils));
