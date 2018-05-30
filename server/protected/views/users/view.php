<?php
/* @var $this UsersController */
/* @var $model Users */

$this->breadcrumbs=array(
	'Users'=>array('index'),
	$model->user_id,
);

$this->menu=array(
	array('label'=>'List Users', 'url'=>array('index')),
	array('label'=>'Create Users', 'url'=>array('create')),
	array('label'=>'Update Users', 'url'=>array('update', 'id'=>$model->user_id)),
	array('label'=>'Delete Users', 'url'=>'#', 'linkOptions'=>array('submit'=>array('delete','id'=>$model->user_id),'confirm'=>'Are you sure you want to delete this item?')),
	array('label'=>'Manage Users', 'url'=>array('admin')),
);
?>

<h1>View Users #<?php echo $model->user_id; ?></h1>

<?php $this->widget('zii.widgets.CDetailView', array(
	'data'=>$model,
	'attributes'=>array(
		'user_id',
		'sex_id',
		'skin_id',
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
	),
)); ?>
