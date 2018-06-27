<div class="container-fluid">
	<header class="section-header">
		<div class="tbl">
			<div class="tbl-row">
				<div class="tbl-cell">
					<h2>Manage Advertisements</h2>
					<div class="subtitle">
						<a href="<?php echo Yii::app()->createUrl('Advertisement/create')?>" 
						style="float: right;" class="btn btn-inline">
							Add Advertisement
						</a>
					</div>
				</div>
			</div>
		</div>
	</header>
	<div class="box-typical box-typical-padding">
		<?php $this->widget('zii.widgets.grid.CGridView', array(
			'id'=>'advertisement-grid',
			'dataProvider'=>$model->search(),
			'itemsCssClass' => 'table table-bordered table-hover',
			'filter'=>$model,
			'columns'=>array(
				array(
					'header'=>'Image',
					'type'=>'raw',
					'value'=>function ($data){ 
						return ($data->image) ? 
						'<img src="'.$data->image.'" style="width:100px;height:100px;"/>' : '';
					}
				), 
				array(
					'header'=>'Url',
					'type'=>'raw',
					'value'=>function ($data){ 
						return ($data->url) ? 
						'<a href="'.$data->url.'" target="_blank" style="text-decoration:underline;">'.$data->url.'</a>' : '';
					}
				), 
				'text',
				array(
					'class'=>'CButtonColumn',
					'htmlOptions' => array('style'=>'width:100px'),
					'template' => '{update}{delete}',
					'buttons'=>array
					(
						'update' => array
						(
							'url'=>'Yii::app()->createUrl("Advertisement/Update", array("id"=>$data->id))',
							'options'=>array('class'=>'glyphicon glyphicon-pencil'),
							'imageUrl'=>'',
							'label'=>''
						),
						'delete' => array
						(
							'url'=>'Yii::app()->createUrl("Advertisement/Delete", array("id"=>$data->id))',
							'options'=>array('class'=>'glyphicon glyphicon-trash'),
							'imageUrl'=>'',
							'label'=>''
						),
					),
				),
			),
		)); ?>
	</div>
</div>
<style>
	a{color:#000; text-decoration: none;border:none !important;margin-right: 5px;}
	a:hover{color:#000;text-decoration: underline;}
</style>

