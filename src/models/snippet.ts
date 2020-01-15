import { prop, getModelForClass } from '@typegoose/typegoose'

export enum Categories {
  frontend = 'frontend',
  backend = 'backend',
  machineLearning = 'machine-learning',
  dependencyInversion = 'dependency-inversion',
  computerGraphics = 'computer-graphics',
  algorithms = 'algorithms',
}

export class Snippet {
  @prop({ required: true })
  userFilename: string

  @prop({ enum: Categories, required: true })
  category: Categories

  @prop({ required: true })
  description: string

  @prop({ required: true })
  codePreview: string

  @prop({ required: true, default: '' })
  pathToFile: string

  @prop({ required: true, default: '' })
  filename: string
}

export const SnippetModel = getModelForClass(Snippet, {
  schemaOptions: { timestamps: true },
})

export async function getFilteredSnippets({
  startDate,
  endDate,
  ...restOptions
}: any) {
  const pattern = restOptions.description ? restOptions.description : '.*'

  const Snippets = await SnippetModel.find({
    ...restOptions,
    createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
    description: { $regex: new RegExp(pattern, 'i') },
  })

  return Snippets
}
