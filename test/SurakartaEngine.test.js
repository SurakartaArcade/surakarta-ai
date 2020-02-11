const assert = require('assert')
const { Surakarta } = require('surakarta')
const { SurakartaEngine } = require('../lib/SurakartaEngine')

require('chai').should()

describe('SurakartaEngine', function () {
    const mockSurakarta = new Surakarta()
    const mockEngine = new SurakartaEngine(mockSurakarta)

    it('Executes without throwing an errors', function () {
        const proposedMove = mockEngine.run()

        assert(proposedMove !== null)
    })
})
