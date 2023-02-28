/**
 * The Json object for to-do list data.
 */
const TREE_DATA = {
    Groceries: {
      'Almond Meal flour': null,
      'Organic eggs': null,
      'Protein Powder': null,
      Fruits: {
        Apple: null,
        Berries: ['Blueberry', 'Raspberry'],
        Orange: null,
      },
    },
    Reminders: ['Cook dinner', 'Read the Material Design spec', 'Upgrade Application to Angular'],
};

/**
 * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
 * The return value is the list of `TodoItemNode`.
 */
// buildFileTree(obj: {[key: string]: any}, level: number): TodoItemNode[] {
//     return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
//         const value = obj[key];
//         const node = new TodoItemNode();
//         node.item = key;

//         if (value != null) {
//         if (typeof value === 'object') {
//             node.children = this.buildFileTree(value, level + 1);
//         } else {
//             node.item = value;
//         }
//         }

//         return accumulator.concat(node);
//     }, []);
// }

// Output
[ {children: [{children: [], item: 'Almond Meal flour'}, {children: [], item: 'Organic eggs'}, {children: [], item: 'Protein Powder'},
        {children: [{children: [], item: 'Apple'}, 
            {children: [{children: [], item: 'Blueberry'}, {children: [], item: 'Raspberry'}], item: "Berries"},
        {children: [], item: 'Orange'}], item: "Fruits"}], item: "Groceries"},

{children: [{children: [], item: 'Cook dinner'}, {children: [], item: 'Read the Material Design spec'}, {children: [], item: 'Upgrade Application to Angular'}], item: "Reminders"}]

