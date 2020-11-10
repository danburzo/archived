# Textpenses

Textpenses is a text-based expense calculator based on a lightweight markup language that is human-readable and machine-parsable.

## Format

### Expenses

Expenses are written as number + currency, e.g. `10 lei` or `$9.00`. Keep one expense per line in your file. 

### Comments

Any line that starts with the `#` character is considered a comment and ignored.

### Tags

You can add tags to categorize your expenses like this: 
```
$10.00 bought a bunch of @books
$5.00 @dinner at that new @restaurant
```

### Sections

You can split your expenses into sections (for example, days of the month) by using a line of dashes as the delimiter. The first comment in each section is used as the title.
```
# Monday, Sept 21

$5.50 stuff
$4 more stuff

---

# Tuesday, Sept 22

$10.00 replacement for previous stuff
```

## Running

Run `npm install` in the textpenses folder to get all dependencies. 

Then you can use `node textpenses.js path/to/your/expenses.txt` to get a summary:

```
┌───────────────────────┬───────┐
│ Section               │ Total │
├───────────────────────┼───────┤
│ 1. Miercuri, 20 aug   │ 792   │
├───────────────────────┼───────┤
│ 2. Joi, 21 aug        │ 82    │
├───────────────────────┼───────┤
│ 3. Vineri, 22 Aug     │ 119   │
├───────────────────────┼───────┤
.................................
├───────────────────────┼───────┤
│ 30. Joi, 18 sept      │ 345   │
├───────────────────────┼───────┤
│ 31. Vineri, 19 sept   │ 72    │
└───────────────────────┴───────┘
```

