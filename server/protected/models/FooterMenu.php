<?php

/**
 * This is the model class for table "footer_menu".
 *
 * The followings are the available columns in table 'footer_menu':
 * @property integer $id
 * @property string $text_en
 * @property string $text_pl
 * @property string $custom_route
 * @property string $external_url
 */
class FooterMenu extends CActiveRecord
{
	public $types = array(
		''=>'Select Type',
		'EXTERNAL_LINK'=>'External URL',
		'STATIC_PAGE' =>'Static Page',
		'CUSTOM_COMPONENT' =>'Custom Component'
	);
	/**
	 * Returns the static model of the specified AR class.
	 * @param string $className active record class name.
	 * @return FooterMenu the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}

	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'footer_menu';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('text_en, text_pl, type', 'required'),
			array('text_en, text_pl, custom_route, external_url, static_page, type', 'length', 'max'=>200),
			// The following rule is used by search().
			// Please remove those attributes that should not be searched.
			array('id, text_en, text_pl, custom_route, external_url, static_page, type', 'safe', 'on'=>'search'),
		);
	}

	/**
	 * @return array relational rules.
	 */
	public function relations()
	{
		// NOTE: you may need to adjust the relation name and the related
		// class name for the relations automatically generated below.
		return array(
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'id' => 'ID',
			'text_en' => 'Text (English)',
			'text_pl' => 'Text (Polish)',
			'type' => 'Type',
			'custom_route' => 'Custom Route',
			'external_url' => 'External Url',
			'static_page' => 'Static Page'
		);
	}

	/**
	 * Retrieves a list of models based on the current search/filter conditions.
	 * @return CActiveDataProvider the data provider that can return the models based on the search/filter conditions.
	 */
	public function search()
	{
		// Warning: Please modify the following code to remove attributes that
		// should not be searched.

		$criteria=new CDbCriteria;

		$criteria->compare('id',$this->id);
		$criteria->compare('text_en',$this->text_en,true);
		$criteria->compare('text_pl',$this->text_pl,true);
		$criteria->compare('type',$this->type,true);
		$criteria->compare('custom_route',$this->custom_route,true);
		$criteria->compare('external_url',$this->external_url,true);
		$criteria->compare('static_page',$this->static_page,true);
		

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}
}