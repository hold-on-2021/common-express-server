class Utils {
    constructor() { }

    applyDiff(text1, changes) {
        let text1List = [...text1];

        // Sort 'remove' changes in descending order of position
        changes.remove.sort((a, b) => b.p - a.p);

        // Apply removals
        changes.remove.forEach(change => {
            text1List.splice(change.p, change.w.length);
        });

        // Sort 'add' changes in ascending order of position
        changes.add.sort((a, b) => a.p - b.p);

        // Apply additions
        changes.add.forEach(change => {
            text1List.splice(change.p, 0, ...change.w);
        });

        return text1List.join('');
    }
}

module.exports = new Utils
