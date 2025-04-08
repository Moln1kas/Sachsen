import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class PostNewBlogDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({ description: "The title of the blog" })
	title: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({ description: "The content of the blog" })
	content: string;
}