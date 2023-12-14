class Context {
    constructor() {
        this.$socket = null
        this.$history_cells = []
        this.$latest_cell_core = ''
        this.$applied_change_id = 0
    }
    clearHistoryCells() {
        this.$history_cells.length = 0
    }
    clearLatestCellCore() {
        this.$latest_cell_core = ''
    }
    get historyCells() {
        return this.$history_cells
    }
    set historyCells(cells) {
        this.$history_cells = cells
    }
    get latestCellCore() {
        return this.$latest_cell_core
    }
    set latestCellCore(core) {
        this.$latest_cell_core = core
    }
    get appliedChangeID() {
        return this.$applied_change_id
    }
    set appliedChangeID(id) {
        this.$applied_change_id = id
    }
    get socket() {
        return this.$socket
    }
    set socket(socket) {
        this.$socket = socket
    }
}

module.exports = new Context;