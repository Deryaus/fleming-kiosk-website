## How to Add or Remove Questions from the Quiz JSON File

### Adding a New Question

To add a new question to the JSON file, follow these steps:

1. Open the `quiz_questions.json` file in a text editor.
2. Inside the `"questions"` array, add a new question object at the desired location.
3. The question object should follow this format:

```json
{
  "question": "Your new question here?",
  "answers": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correct": 0
}
```

4. Ensure that:

   - The `"answers"` array contains four possible answer choices.
   - The `"correct"` value represents the index (starting from 0) of the correct answer in the `"answers"` array.
   - Each question ends with a comma `,` except for the last question in the array.

5. Save the file after making your changes.

### Example:

Adding the following question:

```json
{
  "question": "What color is the sky on a clear day?",
  "answers": ["Blue", "Green", "Red", "Yellow"],
  "correct": 0
}
```

If adding it at the end of the array, ensure the previous question has a comma `,` following the closing curly bracket at the end before adding the new one.

---

### Removing a Question

To remove a question from the JSON file:

1. Locate the question you want to remove in the `"questions"` array.
2. Delete the entire object, including the `{}` braces, along with the preceding comma if it is not the first question.
3. Ensure the remaining format is correct (i.e., no trailing commas on the last question in the array).
4. Save the file.

### Example:

Removing this question:

```json
{
  "question": "What is the name of the Peterborough campus?",
  "answers": [
    "Frost Campus",
    "Sutherland Campus",
    "Haliburton Campus",
    "Cobourg Campus"
  ],
  "correct": 1
}
```

Make sure to:

- Remove any unnecessary trailing commas to maintain valid JSON formatting.
