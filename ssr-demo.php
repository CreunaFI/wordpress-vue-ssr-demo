<?php

/* Plugin name: SSR Demo */

require __DIR__ . '/vendor/autoload.php';

add_filter('acf/settings/save_json', function ($path) {
    $path = __DIR__ . '/acf-json';
    return $path;
});

add_filter('acf/settings/load_json', function ($paths) {
    unset($paths[0]);
    $paths[] = __DIR__ . '/acf-json';
    return $paths;
});


add_action('wp_enqueue_scripts', function () {
    wp_enqueue_script('ssr-script', plugin_dir_url(__FILE__) . '/dist/script.js', [], md5_file(plugin_dir_path(__FILE__) . '/dist/script.js'), true);
});

add_action('acf/init', function () {
    acf_register_block_type([
        'name' => 'ssr-demo',
        'title' => __('SSR Demo'),
        'description' => __('SSR Demo Block'),
        'supports' => [
            'align' => false,
        ],
        'render_callback' => function ($block, $content = '', $is_preview = false) {
            $context = [];
            $context['block'] = $block;
            $context['fields'] = get_fields();
            $context['is_preview'] = $is_preview;

            $encoded_fields = htmlspecialchars(json_encode($context['fields']));

            $process = new Symfony\Component\Process\Process(['node', __DIR__ . '/dist/server.js', 'ssr-demo-app', json_encode($context['fields'])]);

            $process->run();

            $prerendered_data = '';

            if ($process->isSuccessful()) {
                $prerendered_data = $process->getOutput();
            }

            echo '<div class="js-vue"><ssr-demo-app v-bind:context="' . $encoded_fields . '">' . $prerendered_data . '</ssr-demo-app></div>';

        },
    ]);
});