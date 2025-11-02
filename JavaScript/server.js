import express from "express";

class Student {
  constructor(name, age, rollNo) {
    this.name = name;
    this.age = age;
    this.rollNo = rollNo;
  }

  display() {
    console.log(`Hi, I'm ${this.name}, ${this.age} years old, Roll No: ${this.rollNo}`);
  }
}

let students = [
  new Student("Mustafa", 23, 876),
  new Student("Salman", 24, 573),
  new Student("Mohammed", 21, 943),
];

const app = express();
app.use(express.json());

function randomServerError() {
  if (Math.random() < 0.3) {
    throw new Error("Simulated internal server error");
  }
}

// Retry helper (tracks retry count)
async function withRetry(fn, retries = 3, delay = 500) {
  let attempt = 0;
  for (let i = 0; i < retries; i++) {
    attempt = i;
    try {
      const result = await fn();
      //number of retries used
      return { result, retriesUsed: i };
    } catch (err) {
      console.log(`Attempt ${i + 1} failed: ${err.message}`);
      if (i === retries - 1) throw err;
      await new Promise(res => setTimeout(res, delay));
    }
  }
  return { result: null, retriesUsed: attempt };
}

app.get("/students", (req, res) => {
  try {
    randomServerError();
    console.log("Students list:", students.map(s => s.name));
    res.json(students);
  } catch (err) {
    console.error("Internal Server Error:", err.message);
    res.status(500).json({ message: "Internal Server Error, please try again later." });
  }
});

app.get("/student/:rollNo", async (req, res) => {
  const rollNo = parseInt(req.params.rollNo);

  try {
    const { result, retriesUsed } = await withRetry(() => {
      randomServerError();

      const student = students.find(s => s.rollNo === rollNo);
      if (!student) {
        const error = new Error("Student not found");
        error.status = 404;
        throw error;
      }

      student.display();
      return {
        student,
        introduction: `Hi, I'm ${student.name}, ${student.age} years old, Roll No: ${student.rollNo}`,
      };
    });

    res.json({ ...result, retriesUsed });
  } catch (err) {
    if (err.status === 404) {
      return res.status(404).json({ message: err.message });
    }
    console.error("Internal Server Error after retries:", err.message);
    res.status(500).json({ message: "Internal Server Error after multiple attempts" });
  }
});

app.delete("/student/:rollNo", (req, res) => {
  try {
    randomServerError();
    const rollNo = parseInt(req.params.rollNo);
    const index = students.findIndex(s => s.rollNo === rollNo);

    if (index === -1) {
      return res.status(404).json({ message: "Student not found, cannot delete" });
    }

    students.splice(index, 1);
    res.json({ message: `Student with Roll No ${rollNo} deleted successfully`, students });
  } catch (err) {
    console.error("Internal Server Error:", err.message);
    res.status(500).json({ message: "Internal Server Error while deleting student" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
