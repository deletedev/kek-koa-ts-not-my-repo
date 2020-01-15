// Dependencies
import { Context } from 'koa'
import { Controller, Post, Delete } from 'koa-router-ts'
import { SnippetModel } from '../models'
import {
  buildCodePreview,
  buildFile,
  getSnippetPath,
  deleteFile,
} from '../helpers/files'

@Controller('/snippet')
export default class {
  // POST /api/snippet
  @Post('/' /*middlewares*/)
  async createSnippet(ctx: Context) {
    const { userFilename, category, code, description } = ctx.body
    const codePreview = buildCodePreview(code)

    try {
      const snippet = new SnippetModel({
        userFilename,
        description,
        codePreview,
        category,
      })

      await snippet.save()

      const filename = `${snippet._id}-${userFilename}`
      await buildFile(filename, code)

      snippet.pathToFile = getSnippetPath(filename)
      snippet.filename = filename

      await snippet.save()

      const snippets = await SnippetModel.find({}).sort({ createdAt: -1 })

      ctx.status = 201
      ctx.body = snippets
    } catch (err) {
      ctx.status = 400
      ctx.body = { message: err.message }
    }
  }
  // DELETE /api/snippet/:id
  @Delete('/:id' /*middlewares*/)
  async deleteSnippet(ctx: Context) {
    try {
      const snippet = await SnippetModel.find({ _id: ctx.params.id })
      await deleteFile(snippet.pathToFile)
      await snippet.remove()
      await snippet.save()
      ctx.status = 200
    } catch (err) {
      ctx.status = 400
      ctx.body = { message: err.message }
    }
  }
}
