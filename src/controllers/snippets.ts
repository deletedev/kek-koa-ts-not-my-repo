// Dependencies
import { Context } from 'koa'
import { Controller, Get } from 'koa-router-ts'
import { getFilteredSnippets } from '../models'

@Controller('/snippets')
export default class {
  // GET /api/snippets
  @Get('/' /*middlewares*/)
  async searchSnippets(ctx: Context) {
    const { filename: userFilename, ...filters } = ctx.query

    const selectors = {}
    for (let [field, value] of Object.entries({ userFilename, ...filters })) {
      if (value) selectors[field] = value
    }

    const snippets = await getFilteredSnippets(selectors)

    ctx.body = snippets
  }
}
