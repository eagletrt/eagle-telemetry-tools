#!/bin/bash


        echo "setting up vcan ..."
        modprobe vcan
        ip link add dev vcan0 type vcan
        ifconfig vcan0 up
        echo "setup done :)"

