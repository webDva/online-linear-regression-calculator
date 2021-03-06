function doRegression(X_set, Y_set) {
    if (X_set.length <= 1) {
        return -1;
    }

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
    const r_squared = Math.pow(r_xy_correlation, 2) * 100;

    const slope = r_xy_correlation * (y_standardDeviation / x_standardDeviation);
    const y_intercept = y_mean - slope * x_mean;

    return {slope: slope, y_intercept: y_intercept, r_squared: r_squared};
}

function getData() {
    const dataPairs = document.getElementById("dataPairs").value.split("\n");
    let X = [];
    let Y = [];
    for (let i = 0; i < dataPairs.length; i++) {
        X.push(Number(dataPairs[i].split(",")[0]));
        Y.push(Number(dataPairs[i].split(",")[1]));
    }
    return {X: X, Y: Y};
}

function callEverything() {
    const data = getData();
    const line = doRegression(data.X, data.Y);
    if (line === -1 || isNaN(line.slope) || isNaN(line.y_intercept)) return;
    drawChart(line.slope, line.y_intercept, data);
    document.getElementById("slope").innerHTML = line.slope.toFixed(2);
    document.getElementById("yintercept").innerHTML = line.y_intercept.toFixed(2);
    document.getElementById("rsquared").innerHTML = line.r_squared.toFixed(2) + "%";
    document.getElementById("equation").innerHTML = "y = " + line.slope.toFixed(2) + "x + " + line.y_intercept.toFixed(2);
}

function drawChart(slope, yIntercept, dataset) {
    let margin = { top: 0, right: 0, bottom: 40, left: 90 };
    let width = 360 - margin.left - margin.right;
    let height = 360 - margin.top - margin.bottom;

    let svg = d3.select('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .style('background-color', 'black');

    svg.selectAll('*').remove();

    const maximumX = dataset.X.reduce((a, b) => {return Math.max(Math.abs(a), Math.abs(b));}) + 10;
    const maximumY = dataset.Y.reduce((a, b) => {return Math.max(Math.abs(a), Math.abs(b));}) + 10;

    let x = d3.scaleLinear()
        .domain([-maximumX, maximumX])
        .range([margin.left, width + margin.left]);

    let y = d3.scaleLinear()
        .domain([-maximumY, maximumY])
        .range([height + margin.right, margin.top]);

    // add the x Axis
    svg.append("g")
        .attr('class', 'x axis')
        .attr('transform', `translate(${0}, ${margin.top + height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-0.8em')
            .attr('dy', '0em')
            .attr('transform', 'rotate(-65)');

    // add the y Axis
    svg.append("g")
        .attr('class', 'y axis')
        .attr('transform', `translate(${margin.left}, ${0})`)
        .call(d3.axisLeft(y));

    let data = [];
    for (let i = 0; i < dataset.X.length; i++) {
        data.push({x: dataset.X[i], y: dataset.Y[i]});
    }

    svg.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("cx", function (d) { return x(d.x); })
        .attr("cy", function (d) { return y(d.y); })
        .attr("r", "3px")
        .attr("fill", "white");

    // extend the length of the line
    const maximumXY = Math.max(maximumX, maximumY);
    let A = [0, yIntercept], B = [maximumXY, slope * maximumXY + yIntercept];
    let newSlope = (B[1] - A[1]) / (B[0] - A[0]);
    let newY = A[1] + (-maximumXY - A[0]) * newSlope;

    svg.append('line')
        .style("stroke", "lightgreen")
        .style("stroke-width", 2)
        .style("stroke-dasharray", ("2, 2"))
        .attr("x1", x(-maximumXY))
        .attr("y1", y(newY))
        .attr("x2", x(maximumXY))
        .attr("y2", y(slope * maximumXY + yIntercept));
}