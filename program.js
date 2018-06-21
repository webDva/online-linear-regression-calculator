function doRegression(X_set, Y_set) {
    const x_mean = X_set.reduce((sum, current_x) => {return sum + current_x}) / X_set.length;
    const y_mean = Y_set.reduce((sum, current_y) => {return sum + current_y}) / Y_set.length;

    let x_diff_sum2 = 0;
    for (let i = 0; i < X_set.length; i++) {
        x_diff_sum2 += Math.pow(X_set[i] - x_mean, 2);
    }
    const x_standardDeviation = Math.sqrt(x_diff_sum2 / X_set.length);
    let y_diff_sum2 = 0;
    for (let i = 0; i < Y_set.length; i++) {
        y_diff_sum2 += Math.pow(Y_set[i] - y_mean, 2);
    }
    const y_standardDeviation = Math.sqrt(y_diff_sum2 / Y_set.length);
    
    let difference_product = 0;
    let x_difference_squared = 0;
    let y_difference_squared = 0;

    for (let i = 0; i < X_set.length; i++) {
        difference_product += (X_set[i] - x_mean) * (Y_set[i] - y_mean);
        x_difference_squared += Math.pow((X_set[i] - x_mean), 2);
        y_difference_squared += Math.pow((Y_set[i] - y_mean), 2);
    }

    const r_xy_correlation = difference_product / Math.sqrt(x_difference_squared * y_difference_squared);

    const slope = r_xy_correlation * (y_standardDeviation / x_standardDeviation);
    const y_intercept = y_mean - slope * x_mean;

    return {slope: slope, y_intercept: y_intercept};
}

function drawChart(slope, yIntercept) {
    let margin = { top: 20, right: 15, bottom: 20, left: 60 };
    let width = 340 - margin.left - margin.right;
    let height = 340 - margin.top - margin.bottom;

    let svg = d3.select('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .style('background-color', '#efefef');

    svg.selectAll('*').remove();

    let x = d3.scaleLinear()
        .domain([-100, 100])
        .range([margin.left, width + margin.left]);

    let y = d3.scaleLinear()
        .domain([-100, 100])
        .range([height + margin.right, margin.top]);

    // add the x Axis
    svg.append("g")
        .attr('class', 'x axis')
        .attr('transform', `translate(${0}, ${margin.top + height})`)
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
        .attr('class', 'y axis')
        .attr('transform', `translate(${margin.left}, ${0})`)
        .call(d3.axisLeft(y));

    svg.selectAll("circle")
        .data(this.cleanedData)
        .enter().append("circle")
        .attr("cx", function (d) { return x(d[0]); })
        .attr("cy", function (d) { return y(d[1]); })
        .attr("r", "8px")
        .attr("fill", "red");

    // extend the length of the line
    let A = [0, yIntercept], B = [100, slope * 100 + yIntercept];
    let newSlope = (B[1] - A[1]) / (B[0] - A[0]);
    let newY = A[1] + (-100 - A[0]) * newSlope;

    svg.append('line')
        .style("stroke", "blue")
        .style("stroke-width", 4)
        .attr("x1", x(-100))
        .attr("y1", y(newY))
        .attr("x2", x(100))
        .attr("y2", y(slope * 100 + yIntercept));
}