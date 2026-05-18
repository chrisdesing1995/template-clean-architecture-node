import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreatePersonDto } from '@application/persons/dtos/create-person.dto';
import { PersonResponseDto } from '@application/persons/dtos/person-response.dto';
import { UpdatePersonDto } from '@application/persons/dtos/update-person.dto';
import { PersonsService } from '@application/persons/persons.service';
import {
  ApiStandardErrorResponse,
  ApiStandardResponse,
} from '@shared/swagger/decorators/api-standard-response.decorator';

@ApiTags('Persons')
@Controller('persons')
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all persons.' })
  @ApiStandardResponse(PersonResponseDto, {
    description: 'Persons retrieved successfully.',
    isArray: true,
  })
  @ApiStandardErrorResponse(400, 'Bad request.')
  @ApiStandardErrorResponse(500, 'Internal server error.')
  async findAll(): Promise<PersonResponseDto[]> {
    return this.personsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a person by id.' })
  @ApiParam({
    name: 'id',
    description: 'Person unique identifier.',
    example: 'bcc038a8-58a8-4220-b7ea-6021f0403df8',
  })
  @ApiStandardResponse(PersonResponseDto, {
    description: 'Person retrieved successfully.',
  })
  @ApiStandardErrorResponse(400, 'Bad request.')
  @ApiStandardErrorResponse(500, 'Internal server error.')
  async findById(@Param('id') id: string): Promise<PersonResponseDto> {
    return this.personsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new person.' })
  @ApiStandardResponse(PersonResponseDto, {
    status: 201,
    description: 'Person created successfully.',
  })
  @ApiStandardErrorResponse(400, 'Bad request.')
  @ApiStandardErrorResponse(500, 'Internal server error.')
  async create(@Body() payload: CreatePersonDto): Promise<PersonResponseDto> {
    return this.personsService.create(payload);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing person.' })
  @ApiParam({
    name: 'id',
    description: 'Person unique identifier.',
    example: 'bcc038a8-58a8-4220-b7ea-6021f0403df8',
  })
  @ApiStandardResponse(PersonResponseDto, {
    description: 'Person updated successfully.',
  })
  @ApiStandardErrorResponse(400, 'Bad request.')
  @ApiStandardErrorResponse(500, 'Internal server error.')
  async update(
    @Param('id') id: string,
    @Body() payload: UpdatePersonDto,
  ): Promise<PersonResponseDto> {
    return this.personsService.update(id, payload);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a person by id.' })
  @ApiParam({
    name: 'id',
    description: 'Person unique identifier.',
    example: 'bcc038a8-58a8-4220-b7ea-6021f0403df8',
  })
  @ApiStandardResponse(undefined, {
    description: 'Person deleted successfully.',
  })
  @ApiStandardErrorResponse(400, 'Bad request.')
  @ApiStandardErrorResponse(500, 'Internal server error.')
  async delete(@Param('id') id: string): Promise<void> {
    await this.personsService.delete(id);
  }
}
