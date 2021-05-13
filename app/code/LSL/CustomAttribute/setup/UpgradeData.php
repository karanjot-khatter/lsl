<?php
namespace LSL\CustomAttribute\Setup;

use Magento\Eav\Setup\EavSetupFactory;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\ModuleDataSetupInterface;
use Magento\Framework\Setup\UpgradeDataInterface;

/**
* Class UpgradeData
* @package Bibhu\Customattribute\Setup
*/
class UpgradeData implements UpgradeDataInterface
{
/**
* @var EavSetupFactory
*/
private $eavSetupFactory;

/**
* UpgradeData constructor.
* @param EavSetupFactory $eavSetupFactory
*/
public function __construct(EavSetupFactory $eavSetupFactory)
{
$this->eavSetupFactory = $eavSetupFactory;
}

/**
* @param ModuleDataSetupInterface $setup
* @param ModuleContextInterface $context
*/
public function upgrade(
ModuleDataSetupInterface $setup,
ModuleContextInterface $context
) {
$setup->startSetup();

if (version_compare($context->getVersion(), '0.0.3') < 0) {
//$this->upgradeSchema201($setup);
$this->upgradeSchema301($setup);
}

$setup->endSetup();
}

/**
* @param ModuleDataSetupInterface $setup
*/
private function upgradeSchema201(ModuleDataSetupInterface $setup)
{
$eavSetup = $this->eavSetupFactory->create(['setup' => $setup]);

$eavSetup->removeAttribute(
\Magento\Customer\Model\Customer::ENTITY,
'username'
);
}

private function upgradeSchema301(ModuleDataSetupInterface $setup)
{
    $eavSetup = $this->eavSetupFactory->create(['setup' => $setup]);

    $eavSetup->addAttribute(\Magento\Customer\Model\Customer::ENTITY, 'username', [
        'type' => 'varchar',
        'label' => 'Username',
        'input' => 'text',
        'required' => false,
        'visible' => true,
        'user_defined' => true,
        'position' =>999,
        'system' => 0,
    ]);
}
}
