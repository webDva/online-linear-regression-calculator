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

x = [1, 2, 3, 4, 5, 6, 7, 8];
y = [8, 8, 8, 3, 2, -2, -3, -4];
const a = doRegression(x, y);