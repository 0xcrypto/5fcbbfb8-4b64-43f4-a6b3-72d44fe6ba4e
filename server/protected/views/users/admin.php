<script>
	function setVisibility(select){
		var option = $(select).val(),
			user_id = $(select).prev().val();

		$.post( '<?php echo Yii::app()->createUrl('Users/SetVisibility')?>', 
			{
				'id': user_id,
				'visibility': option
			}, function(result) {
			if(result == 'SUCCESS-1'){
				alert('This user is now visibile on home page');
			}
			else if(result == 'SUCCESS-0'){
				alert('This user is now not visibile on home page');
			}
			else if(result == 'VISBILITY_EXISTS'){
				alert('Visibility is already set for 3 users, Please update visibility of one of them before setting visiblity of this user.')
			}
			else{
				alert('Problem in updating visibility, Please try again later');
			}
		});
	}
</script>
<div class="container-fluid">
	<header class="section-header">
		<div class="tbl">
			<div class="tbl-row">
				<div class="tbl-cell">
					<h2>Manage Users </h2>
					<div class="subtitle"></div>
				</div>
			</div>
		</div>
	</header>
	<div class="box-typical box-typical-padding">
		<?php $this->widget('zii.widgets.grid.CGridView', array(
				'id'=>'users-grid',
				'dataProvider'=>$model->search(),
				'filter'=>$model,
				'itemsCssClass' => 'table table-bordered table-hover',
				'columns'=>array(
					array(
						'header'=>'User ID',
						'type'=>'raw',
						'value'=>function ($data){ 
							return $data->user_id;
						}
					), 
					array(
						'header'=>'Firstname',
						'type'=>'raw',
						'value'=>function ($data){ 
							return $data->name1;
						}
					), 
					array(
						'header'=>'Surname',
						'type'=>'raw',
						'value'=>function ($data){ 
							return $data->surname;
						}
					), 
					array(
						'header'=>'Visibility',
						'type'=>'raw',
						'value'=>function ($data){ 
							return "<input type='hidden' value='$data->user_id'>".
							CHtml::dropDownList('visibility', null, array(0=>'No', 1=>'Yes'), 
							array('onChange'=>'setVisibility(this)', 'options' => array($data->visibility=>array('selected'=>true))));
						}
					), 
					/*'name1',
					'surname',
					'buyer_id',
					'grave_id',
					'country_id',
					
					'country_d_id',
					'profession_id',
					'religion_id',
					'religion_name',
					'graveyard_id',
					'place_id',
					'name1',
					'name2',
					'name3',
					'surname',
					'surname_desc',
					'surname_other',
					'gender',
					'ex_wife1',
					'ex_wife2',
					'ex_wife3',
					'maiden_name',
					'nickname',
					'father_name',
					'mother_name',
					'childrens_names',
					'date_birth',
					'place_birth',
					'cityname_now',
					'cityname_history',
					'date_death',
					'place_death',
					'death_reason',
					'cityname_death_now',
					'cityname_death_history',
					'crest',
					'crest_url',
					'other_professions',
					'functions',
					'live_history',
					'father_id',
					'mother_id',
					'hobby',
					'pic_url',
					'is_deleted',
					'c_birth',
					'c_death',
					'country_birth',
					'country_death',
					'grave_image',
					'hobbyids',
					'flash_data',
					'uniq_id',
					'pay_method',
					'paymentid',
					'amount',
					'add_date',
					'language',
					*/
					
					array(
						'class'=>'CButtonColumn',
						'htmlOptions' => array('style'=>'width:100px'),
						'template' => '{update}{delete}',
						'buttons'=>array
						(
							'update' => array
							(
								'url'=>'Yii::app()->createUrl("Users/Update", array("id"=>$data->user_id))',
								'options'=>array('class'=>'glyphicon glyphicon-pencil'),
								'imageUrl'=>'',
								'label'=>''
							),
							'delete' => array
							(
								'url'=>'Yii::app()->createUrl("Users/Delete", array("id"=>$data->user_id))',
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


