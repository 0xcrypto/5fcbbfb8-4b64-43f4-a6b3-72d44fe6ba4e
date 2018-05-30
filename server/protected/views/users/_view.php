<?php
/* @var $this UsersController */
/* @var $data Users */
?>

<div class="view">

	<b><?php echo CHtml::encode($data->getAttributeLabel('user_id')); ?>:</b>
	<?php echo CHtml::link(CHtml::encode($data->user_id), array('view', 'id'=>$data->user_id)); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('sex_id')); ?>:</b>
	<?php echo CHtml::encode($data->sex_id); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('skin_id')); ?>:</b>
	<?php echo CHtml::encode($data->skin_id); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('buyer_id')); ?>:</b>
	<?php echo CHtml::encode($data->buyer_id); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('grave_id')); ?>:</b>
	<?php echo CHtml::encode($data->grave_id); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('country_id')); ?>:</b>
	<?php echo CHtml::encode($data->country_id); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('country_d_id')); ?>:</b>
	<?php echo CHtml::encode($data->country_d_id); ?>
	<br />

	<?php /*
	<b><?php echo CHtml::encode($data->getAttributeLabel('profession_id')); ?>:</b>
	<?php echo CHtml::encode($data->profession_id); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('religion_id')); ?>:</b>
	<?php echo CHtml::encode($data->religion_id); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('religion_name')); ?>:</b>
	<?php echo CHtml::encode($data->religion_name); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('graveyard_id')); ?>:</b>
	<?php echo CHtml::encode($data->graveyard_id); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('place_id')); ?>:</b>
	<?php echo CHtml::encode($data->place_id); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('name1')); ?>:</b>
	<?php echo CHtml::encode($data->name1); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('name2')); ?>:</b>
	<?php echo CHtml::encode($data->name2); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('name3')); ?>:</b>
	<?php echo CHtml::encode($data->name3); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('surname')); ?>:</b>
	<?php echo CHtml::encode($data->surname); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('surname_desc')); ?>:</b>
	<?php echo CHtml::encode($data->surname_desc); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('surname_other')); ?>:</b>
	<?php echo CHtml::encode($data->surname_other); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('gender')); ?>:</b>
	<?php echo CHtml::encode($data->gender); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('ex_wife1')); ?>:</b>
	<?php echo CHtml::encode($data->ex_wife1); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('ex_wife2')); ?>:</b>
	<?php echo CHtml::encode($data->ex_wife2); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('ex_wife3')); ?>:</b>
	<?php echo CHtml::encode($data->ex_wife3); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('maiden_name')); ?>:</b>
	<?php echo CHtml::encode($data->maiden_name); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('nickname')); ?>:</b>
	<?php echo CHtml::encode($data->nickname); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('father_name')); ?>:</b>
	<?php echo CHtml::encode($data->father_name); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('mother_name')); ?>:</b>
	<?php echo CHtml::encode($data->mother_name); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('childrens_names')); ?>:</b>
	<?php echo CHtml::encode($data->childrens_names); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('date_birth')); ?>:</b>
	<?php echo CHtml::encode($data->date_birth); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('place_birth')); ?>:</b>
	<?php echo CHtml::encode($data->place_birth); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('cityname_now')); ?>:</b>
	<?php echo CHtml::encode($data->cityname_now); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('cityname_history')); ?>:</b>
	<?php echo CHtml::encode($data->cityname_history); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('date_death')); ?>:</b>
	<?php echo CHtml::encode($data->date_death); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('place_death')); ?>:</b>
	<?php echo CHtml::encode($data->place_death); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('death_reason')); ?>:</b>
	<?php echo CHtml::encode($data->death_reason); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('cityname_death_now')); ?>:</b>
	<?php echo CHtml::encode($data->cityname_death_now); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('cityname_death_history')); ?>:</b>
	<?php echo CHtml::encode($data->cityname_death_history); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('crest')); ?>:</b>
	<?php echo CHtml::encode($data->crest); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('crest_url')); ?>:</b>
	<?php echo CHtml::encode($data->crest_url); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('other_professions')); ?>:</b>
	<?php echo CHtml::encode($data->other_professions); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('functions')); ?>:</b>
	<?php echo CHtml::encode($data->functions); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('live_history')); ?>:</b>
	<?php echo CHtml::encode($data->live_history); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('father_id')); ?>:</b>
	<?php echo CHtml::encode($data->father_id); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('mother_id')); ?>:</b>
	<?php echo CHtml::encode($data->mother_id); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('hobby')); ?>:</b>
	<?php echo CHtml::encode($data->hobby); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('pic_url')); ?>:</b>
	<?php echo CHtml::encode($data->pic_url); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('is_deleted')); ?>:</b>
	<?php echo CHtml::encode($data->is_deleted); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('c_birth')); ?>:</b>
	<?php echo CHtml::encode($data->c_birth); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('c_death')); ?>:</b>
	<?php echo CHtml::encode($data->c_death); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('country_birth')); ?>:</b>
	<?php echo CHtml::encode($data->country_birth); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('country_death')); ?>:</b>
	<?php echo CHtml::encode($data->country_death); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('grave_image')); ?>:</b>
	<?php echo CHtml::encode($data->grave_image); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('hobbyids')); ?>:</b>
	<?php echo CHtml::encode($data->hobbyids); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('flash_data')); ?>:</b>
	<?php echo CHtml::encode($data->flash_data); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('uniq_id')); ?>:</b>
	<?php echo CHtml::encode($data->uniq_id); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('pay_method')); ?>:</b>
	<?php echo CHtml::encode($data->pay_method); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('paymentid')); ?>:</b>
	<?php echo CHtml::encode($data->paymentid); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('amount')); ?>:</b>
	<?php echo CHtml::encode($data->amount); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('add_date')); ?>:</b>
	<?php echo CHtml::encode($data->add_date); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('language')); ?>:</b>
	<?php echo CHtml::encode($data->language); ?>
	<br />

	*/ ?>

</div>