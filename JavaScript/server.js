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

app.get("/students", (req, res) => {
  console.log("Students list:", students.map(s => s.name));
  res.json(students);
});

app.get("/student/:rollNo", (req, res) => {
  const rollNo = parseInt(req.params.rollNo);
  let student = null;

  for (let i = 0; i < students.length; i++) {
    if (students[i].rollNo === rollNo) {
      student = students[i];
      break;
    }
  }

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  student.display();

  res.json({
    student,
    introduction: `Hi, I'm ${student.name}, ${student.age} years old, Roll No: ${student.rollNo}`,
  });
});

app.delete("/student/:rollNo", (req, res) => {
  const rollNo = parseInt(req.params.rollNo);
  let found = false;

  for (let i = 0; i < students.length; i++) {
    if (students[i].rollNo === rollNo) {
      students.splice(i, 1);
      found = true;
      break;
    }
  }

  if (!found) {
    return res.status(404).json({ message: "Student not found, cannot delete" });
  }

  res.json({ message: `Student with Roll No ${rollNo} deleted successfully`, students });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
