<?php
/**
 * The Header for our theme.
 *
 * Displays all of the <head> and opens the body tag, which is closed in footer.php.
 *
 * @package Hex Digital
 * @subpackage Skeleton Theme
 * @since 2016
 */
?><!DOCTYPE html>
<html <? language_attributes() ?>>
    <head>
        <meta charset="<? bloginfo( 'charset' ) ?>">
        <meta name="viewport" content="width=device-width">
        <title><? wp_title( '|', true, 'right' ) ?></title>
        <? wp_head() ?>
    </head>

    <body <? body_class() ?>>
        <div class="u-svg-icons">
            <? include_once 'build/sprites/sprites.svg' ?>
        </div>
