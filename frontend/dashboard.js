const API_URL =
    "http://localhost:5000/api/expenses";

const BUDGET_URL =
    "http://localhost:5000/api/budget";

const SAVINGS_URL =
    "http://localhost:5000/api/savings";


/* ===============================
   LOGIN CHECK
================================ */

const token =
    localStorage.getItem("token");

const user =
    JSON.parse(
        localStorage.getItem("user")
    );


if (!token || !user) {

    window.location.href =
        "login.html";
}


/* ===============================
   USER
================================ */

document.getElementById(
    "welcomeUser"
).innerText =
    "Welcome, " + user.name;


/* ===============================
   VARIABLES
================================ */

let transactions = [];

let expenseChart = null;


/* ===============================
   DEFAULT MONTH
================================ */

const today =
    new Date();

const currentMonth =
    today.getFullYear() +
    "-" +
    String(
        today.getMonth() + 1
    ).padStart(2, "0");


document.getElementById(
    "monthFilter"
).value =
    currentMonth;


/* ===============================
   LOAD TRANSACTIONS
================================ */

async function loadTransactions() {

    try {

        const response =
            await fetch(
                `${API_URL}/${user.id}`
            );

        transactions =
            await response.json();

        displayTransactions(
            transactions
        );

        updateMonthlyData();

        loadBudget();

        loadSavingsGoals();

    } catch (error) {

        console.log(error);

    }
}


/* ===============================
   MONTHLY DATA
================================ */

function updateMonthlyData() {

    const selectedMonth =
        document.getElementById(
            "monthFilter"
        ).value;


    const monthlyTransactions =
        transactions.filter(
            transaction =>
                transaction.date
                    .substring(0, 7)
                === selectedMonth
        );


    let income = 0;

    let expense = 0;


    monthlyTransactions.forEach(
        transaction => {

            if (
                transaction.type ===
                "income"
            ) {

                income +=
                    Number(
                        transaction.amount
                    );

            } else {

                expense +=
                    Number(
                        transaction.amount
                    );
            }

        }
    );


    const savings =
        income - expense;


    document.getElementById(
        "monthlyIncome"
    ).innerText =
        "₹" +
        income.toLocaleString();


    document.getElementById(
        "monthlyExpense"
    ).innerText =
        "₹" +
        expense.toLocaleString();


    document.getElementById(
        "monthlySavings"
    ).innerText =
        "₹" +
        savings.toLocaleString();


    createExpenseChart(
        monthlyTransactions
    );


    generateMonthlyReport(
        monthlyTransactions,
        income,
        expense,
        savings
    );
}


/* ===============================
   EXPENSE CHART
================================ */

function createExpenseChart(
    data
) {

    const categories = {};

    data.forEach(
        transaction => {

            if (
                transaction.type ===
                "expense"
            ) {

                const category =
                    transaction.category;

                if (!categories[category]) {
                    categories[category] = 0;
                }

                categories[category] +=
                    Number(
                        transaction.amount
                    );
            }

        }
    );


    const labels =
        Object.keys(categories);

    const values =
        Object.values(categories);


    const ctx =
        document.getElementById(
            "expenseChart"
        );


    if (expenseChart) {

        expenseChart.destroy();
    }


    expenseChart =
        new Chart(
            ctx,
            {
                type: "bar",

                data: {

                    labels,

                    datasets: [
                        {
                            label:
                                "Monthly Expenses",

                            data: values
                        }
                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false,

                    scales: {

                        y: {
                            beginAtZero:
                                true
                        }

                    }

                }

            }
        );
}


/* ===============================
   MONTHLY REPORT
================================ */

function generateMonthlyReport(
    data,
    income,
    expense,
    savings
) {

    const categoryTotals = {};


    data.forEach(
        transaction => {

            if (
                transaction.type ===
                "expense"
            ) {

                if (
                    !categoryTotals[
                        transaction.category
                    ]
                ) {

                    categoryTotals[
                        transaction.category
                    ] = 0;
                }

                categoryTotals[
                    transaction.category
                ] +=
                    Number(
                        transaction.amount
                    );
            }

        }
    );


    let highestCategory =
        "No expenses";

    let highestAmount = 0;


    for (
        const category in categoryTotals
    ) {

        if (
            categoryTotals[category]
            > highestAmount
        ) {

            highestAmount =
                categoryTotals[category];

            highestCategory =
                category;
        }
    }


    const report =
        document.getElementById(
            "monthlyReport"
        );


    report.innerHTML = `

        <div class="report-item">
            <strong>Income:</strong>
            ₹${income.toLocaleString()}
        </div>

        <div class="report-item">
            <strong>Expenses:</strong>
            ₹${expense.toLocaleString()}
        </div>

        <div class="report-item">
            <strong>Net Savings:</strong>
            ₹${savings.toLocaleString()}
        </div>

        <div class="report-item">
            <strong>Highest Spending:</strong>
            ${highestCategory}
            - ₹${highestAmount.toLocaleString()}
        </div>

        <div class="report-item">
            <strong>Transactions:</strong>
            ${data.length}
        </div>
    `;
}


/* ===============================
   BUDGET
================================ */

async function loadBudget() {

    const month =
        document.getElementById(
            "monthFilter"
        ).value;


    try {

        const response =
            await fetch(
                `${BUDGET_URL}/${user.id}/${month}`
            );

        const budget =
            await response.json();


        let budgetAmount = 0;


        if (budget) {

            budgetAmount =
                Number(
                    budget.amount
                );
        }


        const monthlyExpense =
            getMonthlyExpense();


        const remaining =
            budgetAmount -
            monthlyExpense;


        document.getElementById(
            "budgetValue"
        ).innerText =
            "₹" +
            budgetAmount.toLocaleString();


        document.getElementById(
            "budgetSpent"
        ).innerText =
            "₹" +
            monthlyExpense.toLocaleString();


        document.getElementById(
            "budgetRemaining"
        ).innerText =
            "₹" +
            remaining.toLocaleString();


        const warning =
            document.getElementById(
                "budgetWarning"
            );


        if (
            budgetAmount > 0 &&
            monthlyExpense >
            budgetAmount
        ) {

            warning.innerHTML =
                `⚠️ Budget exceeded by ₹${(
                    monthlyExpense -
                    budgetAmount
                ).toLocaleString()}`;

            warning.style.color =
                "#dc2626";

        } else if (
            budgetAmount > 0
        ) {

            warning.innerHTML =
                `✓ You have ₹${remaining.toLocaleString()} remaining`;

            warning.style.color =
                "#16a34a";

        } else {

            warning.innerHTML =
                "Set a monthly budget";

        }

    } catch (error) {

        console.log(error);

    }
}


function getMonthlyExpense() {

    const month =
        document.getElementById(
            "monthFilter"
        ).value;


    return transactions
        .filter(
            transaction =>
                transaction.type ===
                "expense" &&
                transaction.date
                    .substring(0, 7)
                === month
        )
        .reduce(
            (
                total,
                transaction
            ) =>
                total +
                Number(
                    transaction.amount
                ),
            0
        );
}


/* SAVE BUDGET */

document.getElementById(
    "saveBudget"
).addEventListener(
    "click",
    async function() {

        const amount =
            Number(
                document.getElementById(
                    "budgetAmount"
                ).value
            );


        const month =
            document.getElementById(
                "monthFilter"
            ).value;


        if (
            !amount ||
            amount <= 0
        ) {

            alert(
                "Enter a valid budget"
            );

            return;
        }


        await fetch(
            BUDGET_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify({
                        userId:
                            user.id,

                        month,

                        amount
                    })
            }
        );


        document.getElementById(
            "budgetAmount"
        ).value = "";


        loadBudget();

    }
);


/* ===============================
   ADD TRANSACTION
================================ */

document.getElementById(
    "expenseForm"
).addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const transaction = {

            userId:
                user.id,

            type:
                document.getElementById(
                    "type"
                ).value,

            amount:
                Number(
                    document.getElementById(
                        "amount"
                    ).value
                ),

            category:
                document.getElementById(
                    "category"
                ).value,

            description:
                document.getElementById(
                    "description"
                ).value,

            date:
                document.getElementById(
                    "date"
                ).value
        };


        try {

            const response =
                await fetch(
                    API_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                transaction
                            )
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                alert(data.message);

                return;
            }


            document.getElementById(
                "expenseForm"
            ).reset();


            loadTransactions();

        } catch (error) {

            console.log(error);

            alert(
                "Server connection failed"
            );
        }

    }
);


/* ===============================
   DISPLAY TRANSACTIONS
================================ */

function displayTransactions(
    data
) {

    const list =
        document.getElementById(
            "transactionList"
        );


    list.innerHTML = "";


    if (data.length === 0) {

        list.innerHTML = `
            <tr>
                <td colspan="6">
                    No transactions found
                </td>
            </tr>
        `;

        return;
    }


    data.forEach(
        transaction => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${new Date(
                        transaction.date
                    ).toLocaleDateString()}
                </td>

                <td class="${transaction.type}">
                    ${transaction.type}
                </td>

                <td>
                    ${transaction.category}
                </td>

                <td>
                    ${transaction.description || "-"}
                </td>

                <td class="${transaction.type}">
                    ₹${Number(
                        transaction.amount
                    ).toLocaleString()}
                </td>

                <td>

                    <button
                        class="action-btn delete-btn"
                        onclick="deleteTransaction('${transaction._id}')"
                    >
                        Delete
                    </button>

                </td>
            `;


            list.appendChild(row);

        }
    );
}


/* ===============================
   DELETE
================================ */

async function deleteTransaction(
    id
) {

    if (
        !confirm(
            "Delete this transaction?"
        )
    ) {
        return;
    }


    await fetch(
        `${API_URL}/${id}`,
        {
            method: "DELETE"
        }
    );


    loadTransactions();
}


/* ===============================
   SEARCH
================================ */

document.getElementById(
    "search"
).addEventListener(
    "input",
    function() {

        const search =
            this.value.toLowerCase();


        const filtered =
            transactions.filter(
                transaction =>

                    (
                        transaction.category +
                        " " +
                        transaction.description +
                        " " +
                        transaction.type +
                        " " +
                        transaction.amount
                    )
                    .toLowerCase()
                    .includes(search)
            );


        displayTransactions(
            filtered
        );
    }
);


/* ===============================
   MONTH CHANGE
================================ */

document.getElementById(
    "monthFilter"
).addEventListener(
    "change",
    function() {

        updateMonthlyData();

        loadBudget();

    }
);


/* ===============================
   SAVINGS GOALS
================================ */

async function loadSavingsGoals() {

    try {

        const response =
            await fetch(
                `${SAVINGS_URL}/${user.id}`
            );

        const goals =
            await response.json();


        const container =
            document.getElementById(
                "savingsGoals"
            );


        container.innerHTML = "";


        goals.forEach(
            goal => {

                const target =
                    Number(
                        goal.targetAmount
                    );

                const saved =
                    Number(
                        goal.savedAmount
                    );


                const remaining =
                    Math.max(
                        0,
                        target - saved
                    );


                const progress =
                    Math.min(
                        100,
                        (saved / target) *
                        100
                    );


                const today =
                    new Date();


                const targetDate =
                    new Date(
                        goal.targetDate
                    );


                const months =
                    Math.max(
                        1,
                        (
                            (
                                targetDate
                                    .getFullYear()
                                -
                                today
                                    .getFullYear()
                            )
                            * 12
                        )
                        +
                        (
                            targetDate
                                .getMonth()
                            -
                            today
                                .getMonth()
                        )
                    );


                const monthlySaving =
                    remaining / months;


                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "savings-goal";


                div.innerHTML = `

                    <h3>
                        🎯 ${goal.productName}
                    </h3>

                    <p>
                        Target:
                        ₹${target.toLocaleString()}
                    </p>

                    <p>
                        Saved:
                        ₹${saved.toLocaleString()}
                    </p>

                    <p>
                        Remaining:
                        ₹${remaining.toLocaleString()}
                    </p>

                    <div class="progress-container">

                        <div
                            class="progress-bar"
                            style="width:${progress}%"
                        ></div>

                    </div>

                    <p>
                        Progress:
                        ${progress.toFixed(1)}%
                    </p>

                    <p>
                        Required monthly saving:
                        <strong>
                            ₹${Math.ceil(
                                monthlySaving
                            ).toLocaleString()}
                        </strong>
                    </p>

                    <button
                        class="delete-goal"
                        onclick="deleteGoal('${goal._id}')"
                    >
                        Delete Goal
                    </button>
                `;


                container.appendChild(
                    div
                );

            }
        );

    } catch (error) {

        console.log(error);

    }
}


/* ADD SAVINGS GOAL */

document.getElementById(
    "savingsForm"
).addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const goal = {

            userId:
                user.id,

            productName:
                document.getElementById(
                    "productName"
                ).value,

            targetAmount:
                Number(
                    document.getElementById(
                        "targetAmount"
                    ).value
                ),

            savedAmount:
                Number(
                    document.getElementById(
                        "savedAmount"
                    ).value
                ),

            targetDate:
                document.getElementById(
                    "targetDate"
                ).value
        };


        await fetch(
            SAVINGS_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(goal)
            }
        );


        this.reset();

        loadSavingsGoals();

    }
);


/* DELETE GOAL */

async function deleteGoal(id) {

    if (
        !confirm(
            "Delete this savings goal?"
        )
    ) {
        return;
    }


    await fetch(
        `${SAVINGS_URL}/${id}`,
        {
            method: "DELETE"
        }
    );


    loadSavingsGoals();
}


/* ===============================
   PRINT REPORT
================================ */

document.getElementById(
    "printReport"
).addEventListener(
    "click",
    function() {

        window.print();

    }
);


/* ===============================
   LOGOUT
================================ */

document.getElementById(
    "logoutButton"
).addEventListener(
    "click",
    function() {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );

        window.location.href =
            "login.html";

    }
);


/* ===============================
   START
================================ */

loadTransactions();