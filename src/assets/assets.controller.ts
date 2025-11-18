import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Put, 
  Delete, 
  ParseIntPipe,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse,
  ApiParam,
  ApiBody
} from '@nestjs/swagger';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { AssetResponseDto } from './dto/asset-response.dto';

@ApiTags('Assets')
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new asset' })
  @ApiBody({ type: CreateAssetDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Asset created successfully',
    type: AssetResponseDto
  })
  async create(@Body() createAssetDto: CreateAssetDto): Promise<AssetResponseDto> {
    return await this.assetsService.create(createAssetDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all assets' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of assets',
    type: [AssetResponseDto]
  })
  async findAll(): Promise<AssetResponseDto[]> {
    return await this.assetsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get asset by ID' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Asset found',
    type: AssetResponseDto
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<AssetResponseDto> {
    return await this.assetsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update asset' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiBody({ type: UpdateAssetDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Asset updated',
    type: AssetResponseDto
  })
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateAssetDto: UpdateAssetDto
  ): Promise<AssetResponseDto> {
    return await this.assetsService.update(id, updateAssetDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove asset' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiResponse({ status: 204, description: 'Asset removed' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.assetsService.remove(id);
  }
}