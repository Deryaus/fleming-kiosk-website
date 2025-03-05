### How to Add or Remove FAQ from the JSON File

### Adding a New Question

To add a new question to the JSON file, follow these steps:

1. Open the `FAQ_questions.json` file in a text editor.
2. Inside the `"questions"` array, add a new question object at the desired location.
3. The question object should follow this format:

```json
{
    "question": "Your new question here?",
    "answer": "Your new answer here",
    "image": "file path to any image you want displayed below the answer."
}

4. Ensure that:
   - The `"answer"` does not contain more than 455 characters.
   - The `"image"` is an optional inclusion. The file path must point to a valid image file, formated as gif, jpg, or png.
   - Each of the lines, excluding the final line has a comma appended.
   -Every entry in the questions list
```

5. Save the file after making your changes.

### Example:

Adding the following question:

```json
{
    "question": "What color is the sky on a clear day?",
    "answers": "Blue!",
    "image": "static/images/blue_sky.png
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
  "answers": "The name of Peterborough campus is Sutherland!",
  "image": "static/images/sutherland_campus.jpg"
}
```

Make sure to:

- Remove any unnecessary trailing commas to maintain valid JSON formatting.
