<div class="container-fluid">
	<header class="section-header">
		<div class="tbl">
			<div class="tbl-row">
				<div class="tbl-cell">
					<h2>Manage Footer Menu </h2>
					<div class="subtitle">
						<a href="<?php echo Yii::app()->createUrl('FooterMenu/create')?>" 
						style="float: right;" class="btn btn-inline">
							Add Footer Menu
						</a>
					</div>
				</div>
			</div>
		</div>
	</header>
	<div class="box-typical box-typical-padding">
		<?php $this->widget('zii.widgets.grid.CGridView', array(
			'id'=>'footer-menu-grid',
			'dataProvider'=>$model->search(),
			'itemsCssClass' => 'table table-bordered table-hover',
			'filter'=>$model,
			'columns'=>array(
				'text_en',
				'text_pl',
				'custom_route',
				'external_url',
				array(
					'class'=>'CButtonColumn',
					'htmlOptions' => array('style'=>'width:150px'),
					'template' => '{view}{update}{delete}',
					'buttons'=>array
					(
						'view' => array
					    (
							'url'=>'Yii::app()->createUrl("FooterMenu/View", array("id"=>$data->id))',
							'options'=>array('class'=>'glyphicon glyphicon-search'),
							'imageUrl'=>'',
							'label'=>'',
						),
						'update' => array
						(
							'url'=>'Yii::app()->createUrl("FooterMenu/Update", array("id"=>$data->id))',
							'options'=>array('class'=>'glyphicon glyphicon-pencil'),
							'imageUrl'=>'',
							'label'=>'',
						),
						'delete' => array
						(
							'url'=>'Yii::app()->createUrl("FooterMenu/Delete", array("id"=>$data->id))',
							'options'=>array('class'=>'glyphicon glyphicon-remove'),
							'imageUrl'=>'',
							'label'=>'',
						),
					)
				),
			),
		)); ?>
	</div>
</div>
<style>
a{color:#000; text-decoration: none;border:none !important;margin-right: 5px;}
a:hover{color:#000;text-decoration: underline;}
</style>

