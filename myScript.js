var payOff = new Array();
payOff[0] = [[3, 1], [0, 0]];
payOff[1] = [[0, 0], [1, 3]];
var payOffT = new Array();
payOffT[0] = [[1, 3], [0, 0]];
payOffT[1] = [[0, 0], [3, 1]];
var Module;
var turn = 0;
var currentTurn = 0;
var totalScore = 0;
var yourScore = 0;
var oppoScore = 0;

function EWAmodule() {
    var K = 0;
    var Lambda = 1.0;
    var N = 1;
    var s = [];
    var oppo_s = [];
    var A = [1.0, 1.0];
    var phi = 0;
    var time = -1;
    var UpdatePhi = function () {
        var h = new Array();
        var r = new Array();
        var S = 0;
        for (var k = 0; k < payOffT[0].length; k++) {
            h.push(0);
            r.push(0);
            for (oppo_s_t in self.oppo_s) {
                if (k == oppo_s_t) {
                    h[k] += 1;
                }
                else {
                    h[k] += 0
                }
            }
            h[k] / (time + 1);
            if (k == oppo_s[oppo_s.length - 1]) {
                r[k] = 1;
            }
            else {
                r[k] = 0;
            }
        }
        for (var k; k < h.length; k++) {
            S += Math.pow((h[k] - r[k]), 2);
        }
        phi = 1 - 0.5 * S;
        return;
    }

    var Phi = function () {
        return phi;
    }

    var Sigma = function (j) {
        var pi_j = payOffT[j][oppo_s[oppo_s.length - 1]][0];
        var pi_t = payOffT[s[s.length - 1]][oppo_s[oppo_s.length - 1]][0];
        if (pi_j >= pi_t) {
            return 1;
        }
        else {
            return 0;
        }
    }

    this.Play = function (time) {
        var Sum = 0;
        var choice = 0.0;
        for (Ai in A) {
            Sum += Math.exp(Lambda * Ai);
        }
        choice = Math.random() * (Sum - 0.0) + 0.0;
        for (var i = 0; i < A.length; i++) {
            if (choice <= Math.exp(Lambda * A[i])) {
                choice = i;
                break;
            }
            else {
                choice -= Math.exp(Lambda * A[i]);
            }
        }
        s.push(choice);
        this.time = time;
        return choice;
    }

    this.Review = function (self_st, oppo_st) {
        oppo_s.push(oppo_st);

        if (self_st != s[s.length - 1]) {
            alert("Strategy Not Matched at Round " + time);
        }

        UpdatePhi();
        for (var i = 0; i < A.length; i++) {
            A[i] = Phi() * N * Math.sqrt(A[i])
            if (i == s[s.length - 1]) {
                A[i] += payOffT[i][oppo_s[oppo_s.length - 1]][0];
            }
            else {
                A[i] += Sigma(i) * payOffT[i][oppo_s[oppo_s.length - 1]][0];
            }
            A[i] /= N * Phi() * (1 - K) + 1;
            A[i] = A[i] * A[i];
        }
        N = N * Phi() * (1 - K) + 1;
        return;
    }
}
function Reinfmodule() {
    var total_payoff = 0;
    var s = 9;
    var Xn = (payOffT[0][0][0] + payOffT[0][1][0] + payOffT[1][0][0] + payOffT[1][1][0]) / 4;
    var belief = [s * Xn / 2, s * Xn / 2];
    var possible = [1 / 2, 1 / 2];
    var epsilon = 0.2;
    var phi = 0.1;
    var time = -1;

    var calculate_str = function () {
        var number = Math.random();
        var tmp = possible[0];
        var k = 0;
        while (true) {
            if (number < tmp) {
                return k;
            }
            else {
                k += 1;
                tmp += possible[k];
            }
            if (k > 1) {
                alert("random number:" + number + "possibility: " + possible[0] + possible[1]);
            }
        }
    }
    this.Play = function (time) {

        this.time = time;
        return calculate_str();
    }

    this.Review = function (self_st, oppo_st) {
        var min_pay_off = Math.min(payOffT[0][0][0], payOffT[0][1][0], payOffT[1][0][0], payOffT[1][1][0]);
        for (var i = 0; i < 2; i++) {
            if (i == self_st) {
                belief[i] = (1 - phi) * belief[i] + (1 - epsilon) * (payOffT[self_st][oppo_st][0] - min_pay_off)
            }
            else {
                belief[i] = (1 - phi) * belief[i] + epsilon * (payOffT[self_st][oppo_st][0] - min_pay_off)
            }
        }
        var total = 0;
        for (var i = 0; i < 2; i++) {
            total += belief[i];
        }
        if (total == 0) {
            for (var i = 0; i < 2; i++) {
                possible[i] = 1.0 / 2;
            }
        }
        else {
            for (var i = 0; i < 2; i++) {
                possible[i] = belief[i] / total;
            }
        }
    }
}
function enterExperiment(modulename) {
    turn = document.getElementById("setTurn").getElementsByTagName("input")[0].value;
    if (turn != Math.round(turn)) {
        turn = 0;
        alert("轮数应该为整数！");
        return;
    }
    if (modulename == "EWA") {
        Module = new EWAmodule();
    }
    else if (modulename == "Reinf") {
        Module = new Reinfmodule();
    }
    document.getElementById("experiment").style.display = "inline";
    document.getElementById("prompt").style.display = "none";
}

function runTheGame() {
    var options = document.getElementsByName("selectStrategy");
    var progressBar = document.getElementById("turnProgress")
    var sa = 0;
    var sb = 0;
    for (var i = 0; i < options.length; i++) {
        if (options[i].checked) {
            sa = i;
            break;
        }
        else {
            continue;
        }
    }
    sb = Module.Play(currentTurn);
    opposcore = payOff[sa][sb][0];
    yourScore = payOff[sa][sb][1];
    totalScore += yourScore;
    //alert(payOff[0][0][0]);
    //alert(oppoScore);
    //alert(yourscore);
    currentTurn++;
    progressBar.style.setProperty("width", currentTurn * 100 / turn + "%")

    var tempt = document.getElementById("scoreBar")
    tempt.getElementsByTagName("span")[0].innerHTML = "得分：" + totalScore + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;轮数：第" + currentTurn + "轮";
    tempt = document.getElementById("lastBenefit")
    tempt = tempt.getElementsByTagName("span");
    tempt[1].innerHTML = sb + "&nbsp;";
    tempt[3].innerHTML = sa + "&nbsp;";
    tempt[5].innerHTML = yourScore;

    if (currentTurn == turn) {
        setTimeout(function () {
            alert("Test finished, Your score is " + totalScore)
            document.getElementById("experiment").style.display = "none";
            document.getElementById("prompt").style.display = "inline";
            location.reload();
        }, 1);
    }
    else {
        Module.Review(sb, sa);
    }
    return;
}

function displayHint1(){
    document.getElementById("hint1").style.display = "inline";
    document.getElementById("hint2").style.display = "none";
}
function displayHint2(){
    document.getElementById("hint2").style.display = "inline";
    document.getElementById("hint1").style.display = "none";
}